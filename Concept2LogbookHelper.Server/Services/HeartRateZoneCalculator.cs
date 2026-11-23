using Concept2LogbookHelper.Server.Models.Concept2;
using Newtonsoft.Json.Linq;

namespace Concept2LogbookHelper.Server.Services;

public static class HeartRateZoneCalculator
{
    // Concept2 lists 24–30 spm as typical rowing cadence (2–2.5 seconds per stroke).
    // Ten seconds accommodates slower strokes while bounding time attributed across pauses.
    // https://www.concept2.com/support/monitors/pm5/how-to-use
    private const int MaximumGap = 100;

    public static HeartRateZoneTotals? Calculate(JArray strokes, HeartRateZoneRequest workout)
    {
        if (strokes.Count == 0) return null;

        int[] limits = workout.IntervalWorkTimes.Length == 0
            ? [workout.WorkTime]
            : workout.IntervalWorkTimes;
        int[] totals = new int[6];
        int interval = 0;
        int remaining = workout.WorkTime;
        int? lastTimestamp = null;
        int? previousTime = null;
        int? previousHeartRate = null;

        bool grouped = strokes[0] is JArray;
        if (grouped)
        {
            if (strokes.Count != limits.Length) return null;
            foreach (var group in strokes)
            {
                if (group is not JArray samples || !Accumulate(samples, detectResets: false)) return null;
                interval++;
                Reset();
            }
        }
        else
        {
            if (!Accumulate(strokes, detectResets: limits.Length > 1) || interval != limits.Length - 1)
                return null;
        }

        return remaining == workout.WorkTime ? null : new(totals[1..], totals[0]);

        bool Accumulate(JArray samples, bool detectResets)
        {
            foreach (var token in samples)
            {
                if (token is not JObject stroke) return false;
                int? time = ReadInteger(stroke["t"]);
                int? heartRate = ReadInteger(stroke["hr"]);
                if (time < 0) time = null;

                if (time < lastTimestamp)
                {
                    if (!detectResets || ++interval >= limits.Length) return false;
                    Reset();
                }

                if (time is int end && previousTime is int start &&
                    heartRate > 0 && previousHeartRate is > 0)
                {
                    int gap = end - start;
                    if (gap is > 0 and <= MaximumGap)
                    {
                        int duration = Math.Min(remaining, Math.Max(0, Math.Min(end, limits[interval]) - start));
                        long percentage = previousHeartRate.Value * 100L / workout.MaxHeartRate;
                        int zone = (int)Math.Clamp((percentage - 40) / 10, 0, 5);
                        totals[zone] += duration;
                        remaining -= duration;
                    }
                }

                if (time.HasValue) lastTimestamp = time;
                previousTime = time;
                previousHeartRate = heartRate;
            }
            return true;
        }

        void Reset()
        {
            lastTimestamp = previousTime = previousHeartRate = null;
        }
    }

    private static int? ReadInteger(JToken? token) =>
        token?.Type == JTokenType.Integer && int.TryParse(token.ToString(), out int value) ? value : null;
}
