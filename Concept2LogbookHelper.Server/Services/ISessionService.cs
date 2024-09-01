using Concept2LogbookHelper.Server.Models;

namespace Concept2LogbookHelper.Server.Services
{
    public interface ISessionService
    {
        Task<SessionData> GetStoredAccessToken(string sessionId);
        Task<string> StoreNewAccessToken(string access_token, string refresh_token, int expires_in);
        Task LogOut(string sessionId);
    }
}