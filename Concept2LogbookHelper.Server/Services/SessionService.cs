using Concept2LogbookHelper.Extensions;
using Concept2LogbookHelper.Server.Models;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Security.Permissions;

namespace Concept2LogbookHelper.Server.Services
{
    public class SessionService : ISessionService
    {

        private readonly IDistributedCache _cache;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public SessionService(IDistributedCache cache, IConfiguration config, HttpClient httpClient)
        {
            this._cache = cache;
            this._config = config;
            this._httpClient = httpClient;
        }

        public async Task<string> StoreNewAccessToken(string access_token, string refresh_token, int expires_in)
        {
            SessionData sessionData = new SessionData()
            {
                accessCode = access_token,
                refreshCode = refresh_token
            };
            string sessionID = Guid.NewGuid().ToString();

            await _cache.SetRecordAsync<SessionData>(sessionID, sessionData, TimeSpan.FromSeconds(expires_in), TimeSpan.FromHours(1));

            return sessionID;
        }

        public async Task<SessionData> GetStoredAccessToken(string sessionId)
        {
            SessionData data =  await _cache.GetRecordAsync<SessionData>(sessionId);

            if (data is null) throw new KeyNotFoundException($"No access token found for session Id: {sessionId}");
            return data;
        }

        public async Task LogOut(string sessionId)
        {
            await _cache.RemoveAsync(sessionId);
        }
    }
}
