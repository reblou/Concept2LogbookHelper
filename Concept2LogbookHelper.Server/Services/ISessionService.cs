using Concept2LogbookHelper.Server.Models;

namespace Concept2LogbookHelper.Server.Services
{
    public interface ISessionService
    {
        Task<string> GetStoredAccessTokenAsync(string sessionId);
        Task<string> StoreNewAccessTokenAsync(string access_token, string refresh_token, int expires_in, string? sessionID = null, int expirationDays = 14);
        Task LogOutAsync(string sessionId);
        Task<StoredToken> GetTokenDetailsAsync(string sessionId);
        Task<string?> TryGetStoredAccessTokenAsync(string sessionId);
        Task<string?> TryGetStoredRefreshTokenAsync(string sessionId);
    }
}