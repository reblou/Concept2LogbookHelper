namespace Concept2LogbookHelper.Server.Models.Concept2
{
    public partial class Split
    {

        public int time { get; set; }
        public int distance { get; set; }
        public int calories_total { get; set; }
        public int stroke_rate { get; set; }
        public HeartRate heart_rate { get; set; }
    }
}
