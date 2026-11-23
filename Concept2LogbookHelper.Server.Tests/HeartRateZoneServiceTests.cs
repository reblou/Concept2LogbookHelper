using System.Net;
using System.Net.Http.Headers;
using Concept2LogbookHelper.Server.Models;
using Concept2LogbookHelper.Server.Models.Concept2;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace Concept2LogbookHelper.Server.Services;

public class HeartRateZoneServiceTests
{
    private static readonly HeartRateZoneRequest Workout = new(9, 200, 100, []);
    private const string Profile = """{"data":{"max_heart_rate":200}}""";
    private const string Strokes = """{"data":[{"t":0,"hr":120},{"t":25,"hr":120}]}""";

    [Theory]
    [InlineData("""{"data":{"max_heart_rate":null}}""")]
    [InlineData("""{"data":{"max_heart_rate":""}}""")]
    [InlineData("""{"data":{}}""")]
    public async Task RequiresPositiveProfileMaxBeforeFetchingStrokes(string profile)
    {
        using var fixture = new ApiFixture(request =>
        {
            Assert.Equal("/api/users/me", request.RequestUri!.AbsolutePath);
            return Task.FromResult(Reply(HttpStatusCode.OK, profile));
        });
        await fixture.Login("session");

        Assert.Null(await fixture.Api.GetProfileMaxHeartRate("session", default));
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            fixture.Api.GetHeartRateZones("session", Workout, default));
    }

    [Fact]
    public async Task SharesInFlightRequestAndKeepsResultsWithinTheSession()
    {
        int strokeRequests = 0;
        var pending = new TaskCompletionSource<HttpResponseMessage>(TaskCreationOptions.RunContinuationsAsynchronously);
        using var fixture = new ApiFixture(request =>
        {
            if (request.RequestUri!.AbsolutePath == "/api/users/me")
                return Task.FromResult(Reply(HttpStatusCode.OK, Profile));

            Assert.Equal("/api/users/me/results/9/strokes", request.RequestUri.AbsolutePath);
            return Interlocked.Increment(ref strokeRequests) == 1
                ? pending.Task
                : Task.FromResult(Reply(HttpStatusCode.OK, Strokes));
        });
        await fixture.Login("first");
        await fixture.Login("second");
        await fixture.Api.GetProfileMaxHeartRate("first", default);
        await fixture.Api.GetProfileMaxHeartRate("second", default);

        var first = fixture.Api.GetHeartRateZones("first", Workout, default);
        var duplicate = fixture.Api.GetHeartRateZones("first", Workout, default);
        pending.SetResult(Reply(HttpStatusCode.OK, Strokes));
        Assert.Same(await first, await duplicate);
        Assert.Same(await first, await fixture.Api.GetHeartRateZones("first", Workout, default));
        Assert.Equal(1, strokeRequests);

        Assert.Equal(25, (await fixture.Api.GetHeartRateZones("second", Workout, default))!.Zones[1]);
        Assert.Equal(2, strokeRequests);
        fixture.Api.ClearHeartRateZones("first");
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            fixture.Api.GetHeartRateZones("first", Workout, default));
    }

    [Fact]
    public async Task RetriesTransientFailureAndCachesDocumentedMissingStrokes()
    {
        int strokeRequests = 0;
        using var fixture = new ApiFixture(request =>
        {
            if (request.RequestUri!.AbsolutePath == "/api/users/me")
                return Task.FromResult(Reply(HttpStatusCode.OK, Profile));

            return Task.FromResult(++strokeRequests == 1
                ? Reply(HttpStatusCode.BadGateway, "")
                : Reply(HttpStatusCode.NotFound, """
                    {"message":"This workout does not have any stroke data associated with it","status_code":404}
                    """));
        });
        await fixture.Login("session");
        await fixture.Api.GetProfileMaxHeartRate("session", default);

        await Assert.ThrowsAsync<HttpRequestException>(() => fixture.Api.GetHeartRateZones("session", Workout, default));
        Assert.Null(await fixture.Api.GetHeartRateZones("session", Workout, default));
        Assert.Null(await fixture.Api.GetHeartRateZones("session", Workout, default));
        Assert.Equal(2, strokeRequests);
    }

    [Fact]
    public async Task PausesNewStrokeRequestsOnUpstreamThrottling()
    {
        int strokeRequests = 0;
        using var fixture = new ApiFixture(request =>
        {
            if (request.RequestUri!.AbsolutePath == "/api/users/me")
                return Task.FromResult(Reply(HttpStatusCode.OK, Profile));

            strokeRequests++;
            var response = Reply(HttpStatusCode.TooManyRequests, "");
            response.Headers.RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(45));
            return Task.FromResult(response);
        });
        await fixture.Login("session");
        await fixture.Api.GetProfileMaxHeartRate("session", default);

        var first = await Assert.ThrowsAsync<StrokeThrottledException>(() =>
            fixture.Api.GetHeartRateZones("session", Workout, default));
        var second = await Assert.ThrowsAsync<StrokeThrottledException>(() =>
            fixture.Api.GetHeartRateZones("session", Workout with { WorkoutId = 10 }, default));
        Assert.Equal(first.RetryAt, second.RetryAt);
        Assert.Equal(1, strokeRequests);
    }

    private static HttpResponseMessage Reply(HttpStatusCode status, string body) =>
        new(status) { Content = new StringContent(body) };

    private sealed class ApiFixture : IDisposable
    {
        private readonly HttpClient _client;
        private readonly MemoryCache _cache = new(new MemoryCacheOptions());
        private readonly SessionService _sessions = new(
            new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions())), "");

        public Concept2APIService Api { get; }

        public ApiFixture(Func<HttpRequestMessage, Task<HttpResponseMessage>> send)
        {
            _client = new HttpClient(new FakeHandler(send));
            Api = new Concept2APIService(_client, Options.Create(new AuthenticationOptions
            {
                Concept2APIUrl = "https://example.test/"
            }), _sessions, NullLogger<Concept2APIService>.Instance, _cache);
        }

        public Task Login(string session) => _sessions.StoreNewAccessTokenAsync("access", "refresh", 3600, session);

        public void Dispose()
        {
            _client.Dispose();
            _cache.Dispose();
        }
    }

    private sealed class FakeHandler(Func<HttpRequestMessage, Task<HttpResponseMessage>> send) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Assert.Equal(new AuthenticationHeaderValue("Bearer", "access"), request.Headers.Authorization);
            return send(request);
        }
    }
}
