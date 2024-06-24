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
        public string type { get; set; }

        // time in 10ths of a second/ decisecond
        public int time { get; set; }

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
                case "VariableIntervalUndefinedRest":
                case "FixedCalorieInterval":
                case "VariableInterval": //v250, 500, 750 etc. // could be time/distance/ or calorie intervals
                    this.pretty_workout_type = FormatUnknownIntervalsTypes();
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

        private string FormatUnknownIntervalsTypes()
        {
            switch(workout.intervals.First().type)
            {
                case "time":
                    return FormatIntervals(workout.intervals.Select(i => i.time).ToList(), FormatDeciseconds);
                case "distance":
                    return FormatIntervals(workout.intervals.Select(i => i.distance).ToList(), i => $"{i}m");
                case "calorie":
                    return FormatIntervals(workout.intervals.Select(i => i.calories_total).ToList(), i=> $"{i}cal");
                default:
                    return "Unknown Intervals";
            }
        }
        private string FormatIntervals(List<int> intervalMeasurable, Func<int, string> formatter)
        {
            if (intervalMeasurable.Distinct().Count() == 1) // fixed intervals
            {
                return $"{intervalMeasurable.Count}x{formatter(intervalMeasurable[0])}";
            }
            else // variable intervals
            {
                return $"v{formatter(intervalMeasurable[0])},{formatter(intervalMeasurable[1])}..";
            }
        }

        private string FormatDeciseconds(int d)
        {
            var t = TimeSpan.FromSeconds(d / 10d);
            return $"{t.TotalMinutes}:{t.Seconds.ToString("D2")}";
        }
    }

}
