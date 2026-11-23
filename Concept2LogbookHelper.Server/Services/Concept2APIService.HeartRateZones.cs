using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Headers;
using Concept2LogbookHelper.Server.Models.Concept2;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Linq;

namespace Concept2LogbookHelper.Server.Services;

public partial class Concept2APIService
{
    private readonly IMemoryCache _zoneCache;
    private readonly SemaphoreSlim _strokeSlots = new(4);
    private long _strokeRetryAfter;

    private sealed class ZoneSession
    {
        public volatile int MaxHeartRate;
        public ConcurrentDictionary<(int, int, string), Lazy<Task<HeartRateZoneTotals?>>> Workouts { get; } = new();
    }

    public async Task<int?> GetProfileMaxHeartRate(string sessionId, CancellationToken cancellationToken)
    {
        CheckCooldown();
        using var response = await SendZoneRequest(sessionId, "api/users/me", cancellationToken);
        ThrowIfThrottled(response);
        if (!response.IsSuccessStatusCode)
            logger.LogWarning("Concept2 profile request returned HTTP {StatusCode}.", (int)response.StatusCode);
        response.EnsureSuccessStatusCode();
        var profile = JObject.Parse(await response.Content.ReadAsStringAsync(cancellationToken));
        if (profile["data"] is not JObject data) throw new Newtonsoft.Json.JsonException();

        var maxValue = data["max_heart_rate"];
        int? max = null;
        if (maxValue is not null && maxValue.Type != JTokenType.Null &&
            !string.IsNullOrWhiteSpace(maxValue.ToString()))
        {
            if (!int.TryParse(maxValue.ToString(), out int parsedMax))
                throw new Newtonsoft.Json.JsonException("Invalid Concept2 profile maximum heart rate.");
            max = parsedMax;
        }
        lock (_zoneCache)
        {
            var session = _zoneCache.GetOrCreate((nameof(ZoneSession), sessionId), entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromHours(1);
                return new ZoneSession();
            })!;
            session.MaxHeartRate = max.GetValueOrDefault();
        }
        return max > 0 ? max : null;
    }

    public async Task<HeartRateZoneTotals?> GetHeartRateZones(string sessionId, HeartRateZoneRequest workout,
        CancellationToken cancellationToken)
    {
        if (!_zoneCache.TryGetValue((nameof(ZoneSession), sessionId), out ZoneSession? session) ||
            session?.MaxHeartRate != workout.MaxHeartRate)
            throw new InvalidOperationException("Refresh the Concept2 profile before analysing strokes.");

        var key = (workout.WorkoutId, workout.MaxHeartRate,
            $"{workout.WorkTime}:{string.Join(",", workout.IntervalWorkTimes)}");
        var request = session.Workouts.GetOrAdd(key, _ => new Lazy<Task<HeartRateZoneTotals?>>(Load));
        return await request.Value.WaitAsync(cancellationToken);

        async Task<HeartRateZoneTotals?> Load()
        {
            try
            {
                return await LoadStrokeTotals(sessionId, workout);
            }
            catch
            {
                session.Workouts.TryRemove(key, out _);
                throw;
            }
        }
    }

    public void ClearHeartRateZones(string sessionId) => _zoneCache.Remove((nameof(ZoneSession), sessionId));

    private async Task<HeartRateZoneTotals?> LoadStrokeTotals(string sessionId, HeartRateZoneRequest workout)
    {
        await _strokeSlots.WaitAsync();
        try
        {
            CheckCooldown();

            using var response = await SendZoneRequest(sessionId,
                $"api/users/me/results/{workout.WorkoutId}/strokes", CancellationToken.None);
            ThrowIfThrottled(response);
            string body = await response.Content.ReadAsStringAsync();
            if (response.StatusCode == HttpStatusCode.NotFound &&
                JObject.Parse(body).Value<string>("message") == "This workout does not have any stroke data associated with it")
                return null;

            response.EnsureSuccessStatusCode();
            if (JObject.Parse(body)["data"] is not JArray strokes) throw new Newtonsoft.Json.JsonException();
            return HeartRateZoneCalculator.Calculate(strokes, workout);
        }
        finally
        {
            _strokeSlots.Release();
        }
    }

    private void CheckCooldown()
    {
        var retryAt = Interlocked.Read(ref _strokeRetryAfter);
        if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() < retryAt) throw new StrokeThrottledException(retryAt);
    }

    private async Task<HttpResponseMessage> SendZoneRequest(string sessionId, string path,
        CancellationToken cancellationToken)
    {
        var accessToken = await GetAccessToken(sessionId);
        using var request = new HttpRequestMessage(HttpMethod.Get, $"{_auth.Concept2APIUrl.TrimEnd('/')}/{path}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.Accept.ParseAdd("application/vnd.c2logbook.v1+json");
        return await _httpClient.SendAsync(request, cancellationToken);
    }

    private void ThrowIfThrottled(HttpResponseMessage response)
    {
        if (response.StatusCode != HttpStatusCode.TooManyRequests) return;

        var now = DateTimeOffset.UtcNow;
        var retryAt = response.Headers.RetryAfter?.Date ??
            now.Add(response.Headers.RetryAfter?.Delta ?? TimeSpan.FromSeconds(30));
        long deadline = Math.Max(now.ToUnixTimeSeconds() + 1, retryAt.ToUnixTimeSeconds() + 1);
        lock (_strokeSlots)
        {
            deadline = Math.Max(deadline, Interlocked.Read(ref _strokeRetryAfter));
            Interlocked.Exchange(ref _strokeRetryAfter, deadline);
        }
        throw new StrokeThrottledException(deadline);
    }
}

public sealed class StrokeThrottledException(long retryAt) : Exception
{
    public long RetryAt { get; } = retryAt;
}
