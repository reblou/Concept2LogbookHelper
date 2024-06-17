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
        public int time { get; set; }
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

        public string pretty_workout_type { get; set; }
    }
}
