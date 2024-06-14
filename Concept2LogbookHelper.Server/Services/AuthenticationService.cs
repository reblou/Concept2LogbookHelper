using Concept2LogbookHelper.Extensions;
using Concept2LogbookHelper.Server.Models;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Security.Permissions;

namespace Concept2LogbookHelper.Server.Services
{
    public class AuthenticationService : IAuthenticationService
    {

        private readonly IDistributedCache _cache;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly IConcept2APIService _concept2APIService;

        public AuthenticationService(IDistributedCache cache, IConfiguration config, HttpClient httpClient, )
        {
            this._cache = cache;
            this._config = config;
            this._httpClient = httpClient;
        }

        public async Task<string> GetAndStoreNewAccessToken(string accessCode)
        {
            AccessToken accessToken = await _concept2APIService.GetAccessToken(accessCode);

            SessionData sessionData = new SessionData()
            {
                accessCode = accessToken.access_token,
                refreshCode = accessToken.refresh_token
            };
            string sessionID = Guid.NewGuid().ToString();

            //TODO: do we want to store refresh token? record will expire and will be lost therefore cannot use refresh call...
            _cache.SetRecordAsync<SessionData>(sessionID, sessionData, TimeSpan.FromSeconds(accessToken.expires_in), TimeSpan.FromHours(1));

            return sessionID;
        }

        public async Task<SessionData> GetStoredAccessToken(string sessionId)
        {
            SessionData data =  await _cache.GetRecordAsync<SessionData>(sessionId);

            if (data is null) throw new KeyNotFoundException($"No access token found for session Id: {sessionId}");
            return data;
        }
    }
}
