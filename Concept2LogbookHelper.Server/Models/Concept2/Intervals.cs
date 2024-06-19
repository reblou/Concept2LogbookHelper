using Concept2LogbookHelper.Server.Models.Concept2;

public class Interval
{
    public string machine { get; set; }
    public string type { get; set; }
    public int time { get; set; }
    public int distance { get; set; }
    public int calories_total { get; set; }
    public int stroke_rate { get; set; }
    public int rest_distance { get; set; }
    public int rest_time { get; set; }
    public HeartRate heart_rate { get; set; }
    public Targets targets { get; set; }
}
