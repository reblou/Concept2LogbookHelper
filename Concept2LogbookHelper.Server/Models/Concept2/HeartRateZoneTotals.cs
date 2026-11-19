using System.ComponentModel.DataAnnotations;

namespace Concept2LogbookHelper.Server.Models.Concept2;

public sealed record HeartRateZoneRequest(
    [Range(1, int.MaxValue)] int WorkoutId,
    [Range(1, int.MaxValue)] int MaxHeartRate,
    [Range(1, int.MaxValue)] int WorkTime,
    [Required] int[] IntervalWorkTimes);

public sealed record HeartRateZoneTotals(int[] Zones, int BelowZone);
