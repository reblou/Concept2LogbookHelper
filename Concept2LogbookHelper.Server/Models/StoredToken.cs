namespace Concept2LogbookHelper.Server.Models
{
    public class StoredToken
    {

        public bool AccessTokenExists { get; set; }
        public bool RefreshTokenExists { get; set; }
        public DateTime? RefreshExpiryDate { get; set; }
        public DateTime? AccessExpiryDate { get; set; }
    }
}
