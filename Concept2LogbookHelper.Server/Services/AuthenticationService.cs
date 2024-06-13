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

        private readonly IDistributedCache cache;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AuthenticationService(IDistributedCache cache, IConfiguration config, HttpClient httpClient)
        {
            this.cache = cache;
            this._config = config;
            this._httpClient = httpClient;
        }

        public string GetAccessToken(string accessCode)
        {
            string url = $"{_config["Authentication:Concept2APIUrl"]}oauth/access_token";

            FormUrlEncodedContent body = new FormUrlEncodedContent(new Dictionary<string, string>() {
                { "client_id", _config["client_id"]},
                { "client_secret", _config["client_secret"]},
                {"code", accessCode },
                {"grant_type", _config["Authentication:GrantType"]},
                {"scope", _config["Authentication:Scope"] },
                {"redirect_uri",  _config["Authentication:RedirectURI"]}


            });

            HttpResponseMessage response = _httpClient.PostAsync(url, body).Result;

            if (!response.IsSuccessStatusCode) throw new BadHttpRequestException("Failed to authenticate user");

            string content = response.Content.ReadAsStringAsync().Result;
            AccessToken accessToken = JsonConvert.DeserializeObject<AccessToken>(content);
            SessionData sessionData = new SessionData()
            {
                accessCode = accessToken.access_token,
                refreshCode = accessToken.refresh_token
            };
            string sessionID = Guid.NewGuid().ToString();
            cache.SetRecordAsync<SessionData>(sessionID, sessionData, TimeSpan.FromSeconds(accessToken.expires_in), TimeSpan.FromHours(1));

            return sessionID;
        }
    }
}
