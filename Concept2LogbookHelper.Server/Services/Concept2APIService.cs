using Concept2LogbookHelper.Server.Models;
using Concept2LogbookHelper.Server.Models.Concept2;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.OpenApi.Extensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Concept2LogbookHelper.Server.Services
{
    public class Concept2APIService : IConcept2APIService
    {
        // Concept2 API limit on paged results
        const int max_returned_per_page = 250;


        private HttpClient _httpClient;
        private IConfiguration _config;
        private ISessionService _sessionService;

        public Concept2APIService(HttpClient httpClient, IConfiguration configuration, ISessionService authenticationService)
        {
            this._httpClient = httpClient;
            this._config = configuration;
            _sessionService = authenticationService;
        }

        private async Task<string> GetAccessToken(string sessionId)
        {
           return await _sessionService.GetStoredAccessToken(sessionId);
        }

        private async Task<T> SendRequest<T>(string accessCode, string url, HttpMethod method)
        {
            HttpRequestMessage request = new HttpRequestMessage(method, url)
            {
                Headers =
                {
                    {HttpRequestHeader.Authorization.ToString(), $"Bearer {accessCode}" },
                    {HttpRequestHeader.ContentType.ToString(),  "application/json"}
                }
            };

            HttpResponseMessage response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();
            string content = await response.Content.ReadAsStringAsync();

            T results = JsonConvert.DeserializeObject<T>(content);
            return results;
        }

        public async Task<int> GetNumberOfResults(string sessionId)
        {
            GetResults results = await SendRequest<GetResults>(sessionId, $"{_config["Authentication:Concept2APIUrl"]}/api/users/me/results?type=rower", HttpMethod.Get);

            return results.meta.pagination.total;
        }

        public async Task<AccessToken> GetAccessTokenGrant(string code, string? redirectUrl = null)
        {
            FormUrlEncodedContent body = new FormUrlEncodedContent(new Dictionary<string, string>() {
                { "client_id", _config["client_id"]},
                { "client_secret", _config["client_secret"]},
                {"code", code },
                {"grant_type", "authorization_code"},
                {"scope", _config["Authentication:Scope"] },
                {"redirect_uri",  redirectUrl ?? _config["Authentication:RedirectURI"]}
            });

            return await GetAccessToken(body);
        }

        public async Task<AccessToken> GetAccessTokenRefreshGrant(string refreshToken)
        {
            FormUrlEncodedContent body = new FormUrlEncodedContent(new Dictionary<string, string>() {
                { "client_id", _config["client_id"]},
                { "client_secret", _config["client_secret"]},
                {"grant_type", "refresh_token"},
                {"scope", _config["Authentication:Scope"] },
                {"refresh_token",  refreshToken} 
            });

            return await GetAccessToken(body);
        }

        private async Task<AccessToken> GetAccessToken(HttpContent? body)
        {
            string url = $"{_config["Authentication:Concept2APIUrl"]}oauth/access_token";

            HttpResponseMessage response = await _httpClient.PostAsync(url, body);

            if (!response.IsSuccessStatusCode) throw new BadHttpRequestException("Failed to authenticate user");

            string content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<AccessToken>(content);
        }

        public async Task<GetResults> GetResults(string accessToken, int page = 1, int? size = null)
        {
            if (size > max_returned_per_page) throw new ArgumentException("Size is larger than C2 API max");

            // if no arg passed, set to API max
            size ??= max_returned_per_page;

            GetResults results = await SendRequest<GetResults>(accessToken, 
                $"{_config["Authentication:Concept2APIUrl"]}/api/users/me/results?number={size}&page={page}", HttpMethod.Get);
            results.data.ForEach(result => result.CalculateAndSetPrettyWorkoutType());
            return results;
        }

        public async Task<List<Result>> GetAllResults(string sessionId)
        {
            string accessToken = await GetAccessToken(sessionId);

            GetResults results = await GetResults(accessToken);

            List<Result> data = results.data;

            // iterate any further pages to return all results
            for(int i = 2; i < results.meta.pagination.total_pages+1; i++)
            {
                var res = await GetResults(accessToken, i);
                data.AddRange(res.data);
            }

            //data.ForEach(result => result.CalculateAndSetPrettyWorkoutType());

            return data;
        }
    }
}
