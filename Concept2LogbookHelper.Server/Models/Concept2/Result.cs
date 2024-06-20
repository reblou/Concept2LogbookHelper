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
        public string pretty_workout_type { get {
                return GetPrettyWorkoutType();
                    } }

        private string GetPrettyWorkoutType()
        {
            //TODO: add all other possible workout types
            switch (workout_type)
            {
                case "JustRow":
                    return "JustRow";
                case "FixedDistanceInterval": //8x 500m
                case "VariableInterval": //v250, 500, 750 etc. // could be time/distance/ or calorie intervals
                    return FormatDistanceIntervals();
                case "FixedDistanceSplits": // fixed distance
                    return $"{distance}m";
                case "FixedTimeInterval":
                    return FormatTimeIntervals();
                case "unknown":
                    return "Web";
                default:
                    return "Unknown";
            }
        }

        private string FormatDistanceIntervals()
        {
            List<int> intervalDists = workout.intervals.Select(i => i.distance).ToList();

            if(intervalDists.Distinct().Count() == 1)
            {
                // fixed intervals
                return $"{intervalDists.Count}x{intervalDists[0]}m";
            }
            else
            {
                return $"v{intervalDists[0]}m,{intervalDists[1]}m..";
            }
        }

        private string FormatTimeIntervals()
        {            
            //workout.intervals.First().type == "time";

            //interval time in deciseconds
            List<int> intervalTimes = workout.intervals.Select(i => i.time).ToList();

            if (intervalTimes.Distinct().Count() == 1)
            {
                // fixed intervals
                var time = TimeSpan.FromSeconds(intervalTimes[0] / 10d);
                return $"{intervalTimes.Count}x{FormatMinutesAndSeconds(time)}";
            }
            else
            {
                var time = TimeSpan.FromSeconds(intervalTimes[0] / 10d);
                var secondTime = TimeSpan.FromSeconds(intervalTimes[1] / 10d);

                return $"v{FormatMinutesAndSeconds(time)},{FormatMinutesAndSeconds(secondTime)}..";
            }


        }

        private string FormatMinutesAndSeconds(TimeSpan t)
        {
            return $"{t.TotalMinutes}:{t.Seconds.ToString("D2")}";
        }
    }

}
