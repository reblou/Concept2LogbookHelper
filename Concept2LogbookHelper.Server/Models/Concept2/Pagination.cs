namespace Concept2LogbookHelper.Server.Models.Concept2
{
    public class Pagination
    {
        public int total { get; set; }
        public int count { get; set; }
        public int per_page { get; set; }
        public int current_page { get; set; }
        public int total_page { get; set; }
        public Dictionary<string, string> links { get; set; }

    }
}
