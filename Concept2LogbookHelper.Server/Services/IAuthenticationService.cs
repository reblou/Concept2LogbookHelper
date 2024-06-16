using Concept2LogbookHelper.Server.Models;

namespace Concept2LogbookHelper.Server.Services
{
    public interface IAuthenticationService
    {
        Task<SessionData> GetStoredAccessToken(string sessionId);
        Task<string> StoreNewAccessToken(AccessToken accessToken);
    }
}