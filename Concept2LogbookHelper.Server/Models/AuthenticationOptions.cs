namespace Concept2LogbookHelper.Server.Models
{
    public class AuthenticationOptions
    {
        public string RedirectURI { get; set; }
        public string Scope { get; set; }
        public string Concept2APIUrl { get; set; }
        public string DummySessionId { get; set; }
        public string DummyRedirectURI { get; set; }
        public string client_id { get; set; }
        public string client_secret { get; set; }
        public string dummy_login_key { get; set; }
    }
}
