using Concept2LogbookHelper.Server.Models.Concept2;
using Newtonsoft.Json.Linq;

namespace Concept2LogbookHelper.Server.Services;

public class HeartRateZoneCalculatorTests
{
    [Fact]
    public void AssignsIrregularSpansToEarlierReadingsAtExactBoundaries()
    {
        var result = Calculate("""
            [
              {"t":0,"hr":99}, {"t":20,"hr":100}, {"t":41,"hr":120},
              {"t":63,"hr":140}, {"t":86,"hr":160}, {"t":110,"hr":180},
              {"t":135,"hr":210}, {"t":161,"hr":180}
            ]
            """, 12086);

        Assert.Equal(20, result!.BelowZone);
        Assert.Equal([21, 22, 23, 24, 51], result.Zones);
    }

    [Fact]
    public void SkipsInvalidSamplesDuplicateTimestampsAndLongGaps()
    {
        var result = Calculate("""
            [
              {"t":0,"hr":120}, {"t":20}, {"t":40,"hr":120}, {"hr":120},
              {"t":60,"hr":120}, {"t":60,"hr":140}, {"t":80,"hr":140},
              {"t":181,"hr":160}, {"t":200,"hr":0}, {"t":220,"hr":160},
              {"t":239,"hr":160}
            ]
            """, 12086);

        Assert.Equal([0, 0, 20, 19, 0], result!.Zones);
    }

    [Fact]
    public void CapsSteadyWorkAtResultTime()
    {
        var result = Calculate("""
            [{"t":12060,"hr":150}, {"t":12100,"hr":150}, {"t":12120,"hr":150}]
            """, 12086);

        Assert.Equal(26, result!.Zones.Sum());
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ResetsAtIntervalsAndExcludesRecovery(bool grouped)
    {
        var first = """[{"t":8022,"hr":100}, {"t":8052,"hr":100}, {"t":8082,"hr":200}]""";
        var second = """[{"t":0,"hr":120}, {"t":25,"hr":120}, {"t":6673,"hr":120}, {"t":6723,"hr":200}]""";
        var third = """[{"t":0,"hr":140}, {"t":25,"hr":140}, {"t":5318,"hr":140}, {"t":5348,"hr":200}]""";
        var strokes = grouped ? $"[{first},{second},{third}]" : $"[{first[1..^1]},{second[1..^1]},{third[1..^1]}]";
        var result = Calculate(strokes, 20103, [8052, 6703, 5348]);

        Assert.Equal([30, 55, 55, 0, 0], result!.Zones);
    }

    [Fact]
    public void ExcludesRecoveryTailBeforeEachProductionTimestampReset()
    {
        // Timestamps sampled around work and recovery boundaries, with synthetic HR values.
        var result = Calculate("""
            [
              {"t":8032,"hr":180}, {"t":8074,"hr":120}, {"t":8076,"hr":120},
              {"t":8826,"hr":120}, {"t":8851,"hr":120},
              {"t":2,"hr":140}, {"t":22,"hr":140},
              {"t":6695,"hr":180}, {"t":6713,"hr":120}, {"t":6743,"hr":120},
              {"t":6935,"hr":120}, {"t":6955,"hr":120},
              {"t":3,"hr":140}, {"t":23,"hr":140},
              {"t":5346,"hr":180}, {"t":5376,"hr":120}, {"t":5416,"hr":120}
            ]
            """, 20103, [8052, 6703, 5348]);

        Assert.Equal([0, 0, 40, 0, 30], result!.Zones);
        Assert.Equal(0, result.BelowZone);
    }

    [Fact]
    public void KeepsBelowZoneDurationWhenNoZonesAreChartable()
    {
        var result = Calculate("""[{"t":0,"hr":90}, {"t":25,"hr":90}]""", 100);

        Assert.Equal(25, result!.BelowZone);
        Assert.Equal(0, result.Zones.Sum());
    }

    [Fact]
    public void SkipsIntervalsWhoseBoundariesCannotBeIdentified()
    {
        Assert.Null(Calculate("""[{"t":0,"hr":120}, {"t":25,"hr":120}]""", 200, [100, 100]));
        Assert.Null(Calculate("""[{"t":0,"hr":120}]""", 100));
    }

    private static HeartRateZoneTotals? Calculate(string strokes, int workTime, int[]? limits = null) =>
        HeartRateZoneCalculator.Calculate(JArray.Parse(strokes), new(1, 200, workTime, limits ?? []));
}
