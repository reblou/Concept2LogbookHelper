﻿using Concept2LogbookHelper.Server.Models;

namespace Concept2LogbookHelper.Server.Services
{
    public interface ISessionService
    {
        Task<string> GetStoredAccessToken(string sessionId);
        Task<string> StoreNewAccessToken(string access_token, string refresh_token, int expires_in, string? sessionID = null, int expirationDays = 14);
        Task LogOut(string sessionId);
        Task<string> GetStoredRefreshToken(string sessionId);
        Task<StoredToken> GetTokenDetails(string sessionId);
    }
}