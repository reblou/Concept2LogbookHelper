using Concept2LogbookHelper.Server.Models;
using Concept2LogbookHelper.Server.Models.Concept2;
using Microsoft.OpenApi.Extensions;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;

namespace Concept2LogbookHelper.Server.Services
{
    public class Concept2APIService : IConcept2APIService
    {
        private HttpClient _httpClient;
        private IConfiguration _config;
        private ISessionService _authenticationService;

        public Concept2APIService(HttpClient httpClient, IConfiguration configuration, ISessionService authenticationService)
        {
            this._httpClient = httpClient;
            this._config = configuration;
            _authenticationService = authenticationService;
        }

        public async Task<int> GetNumberOfResults(string sessionId)
        {
            SessionData sessionData = await _authenticationService.GetStoredAccessToken(sessionId);

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"{_config["Authentication:Concept2APIUrl"]}/api/users/me/results")
            {
                Headers =
                {
                    {HttpRequestHeader.Authorization.ToString(), $"Bearer {sessionData.accessCode}" },
                    {HttpRequestHeader.ContentType.ToString(),  "application/json"}
                }
            };

            HttpResponseMessage response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            string content = await response.Content.ReadAsStringAsync();

            GetResults results = JsonConvert.DeserializeObject<GetResults>(content);

            if (results is null) return 0;

            return results.data.Count;
        }

        public async Task<AccessToken> GetAccessToken(string accessCode)
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

            HttpResponseMessage response = await _httpClient.PostAsync(url, body);

            if (!response.IsSuccessStatusCode) throw new BadHttpRequestException("Failed to authenticate user");

            string content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<AccessToken>(content);
        }
    }
}
