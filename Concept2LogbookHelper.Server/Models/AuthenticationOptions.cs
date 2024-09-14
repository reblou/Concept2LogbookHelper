namespace Concept2LogbookHelper.Server.Models
{
    public class AuthenticationOptions
    {
        public string RedirectURI { get; set; }
        public string Scope { get; set; }
        public string Concept2APIUrl { get; set; }
        public string DummySessionId { get; set; }
    }
}
