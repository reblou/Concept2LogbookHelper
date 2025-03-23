namespace Concept2LogbookHelper.Server.Models.Concept2
{
    public class Result
    {
        public int id { get; set; }
        public string user_id { get; set; }
        public DateTime date { get; set; }
        public string TimeZone { get; set; }
        public DateTime? date_utc { get; set; }
        public int distance { get; set; }
        public int rest_distance { get; set; }
        public int total_distance { get { 
                return distance + rest_distance;
            } }

        public string type { get; set; }

        // time in 10ths of a second/ decisecond, only working time not total
        public int time { get; set; }
        public int rest_time { get; set; }
        public int total_time { get => time + rest_time; }

        //This is the total time + rest times..
        public string time_formatted { get; set; }
        public string workout_type { get; set; }
        public string source { get; set; }
        public string weight_class { get; set; }
        public bool verified { get; set; }
        public bool ranked { get; set; }
        public string comments { get; set; }
        public string privacy { get; set; }
        public bool stroke_data { get; set; }
        public int calories_total { get; set; }
        public int drag_factor { get; set; }
        public int stroke_count { get; set; }
        public int stroke_rate { get; set; }
        public HeartRate heart_rate { get; set; }
        public Workout workout { get; set; }
        public object real_time { get; set; }

        //average pace/ 500m in seconds with one decimal place
        public double average_pace { get {
                return 500 * ((time / 10d) / distance);
            } }

        public string pretty_average_pace
        { get {
                return TimeSpan.FromSeconds(average_pace).ToString(@"mm\:ss\.f"); ;

            } }
        public string pretty_workout_type { get; set; }

        public void CalculateAndSetPrettyWorkoutType()
        {
            switch (workout_type)
            {
                case "JustRow":
                    this.pretty_workout_type = "JustRow";
                    break;
                case "FixedDistanceInterval": //8x 500m
                case "FixedTimeInterval":
                case "FixedCalorieInterval":
                    this.pretty_workout_type = FormatFixedIntervals(this.workout.intervals);
                    break;
                case "VariableInterval": //v250, 500, 750 etc. // could be time/distance/ or calorie intervals 
                case "VariableIntervalUndefinedRest":
                    this.pretty_workout_type = FormatVariableIntervals(this.workout.intervals);
                    break;
                case "FixedDistanceSplits": // fixed distance
                    this.pretty_workout_type = $"{distance}m";
                    break;
                case "FixedCalorie":
                    this.pretty_workout_type = $"{calories_total}cal";
                    break;
                case "FixedTimeSplits":
                    this.pretty_workout_type = time_formatted;
                    break;
                case "unknown":
                    this.pretty_workout_type = "Web";
                    break;
                default:
                    this.pretty_workout_type = "Unknown";
                    break;
            }
        }

        private string FormatFixedIntervals(List<Interval> intervals)
        {
            if (intervals is null || intervals.Count == 0) return "Invalid Intervals";

            return $"{intervals.Count}x{FormatInterval(intervals.First())}";
        }

        private string FormatVariableIntervals(List<Interval> intervals)
        {
            if (intervals is null || intervals.Count == 0) return "Invalid Intervals";

            var first = $"v{FormatInterval(intervals.First())}";

            var second = intervals.Count > 1 ? $",{FormatInterval(intervals[1])}" : "";

            return $"{first}{second}..{intervals.Count}";
        }

        private string FormatInterval(Interval interval)
        {
            switch(interval.type)
            {
                case "time":
                    return FormatDeciseconds(interval.time);
                case "distance":
                    return $"{interval.distance}m";
                case "calorie":
                    return $"{interval.calories_total}cal";
                default:
                    return "N/A";
            }
        }

        private string FormatDeciseconds(int d)
        {
            var t = TimeSpan.FromSeconds(d / 10d);
            return $"{t.Minutes}:{t.Seconds.ToString("D2")}";
        }
    }

}
