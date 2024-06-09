using Concept2LogbookHelper.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using System.Web;

namespace Concept2LogbookHelper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly HttpClient client;
        private readonly IConfiguration _config;
        private readonly AuthenticationOptions authOptions;
        public AuthenticationController(IConfiguration config)
        {
            _config = config;
            client = new HttpClient();
            authOptions = config.GetSection("Authentication").Get<AuthenticationOptions>();
        }

        [HttpGet]
        [Route("redirect")]
        public RedirectResult RedirectToC2Login()
        {
            return Redirect($"{authOptions.Concept2APIUrl}oauth/authorize?client_id={_config["client_id"]}&scope={authOptions.Scope}&response_type={authOptions.ResponseType}&redirect_uri={authOptions.RedirectURI}");
        }

        [HttpGet]
        public RedirectResult GetAccessToken([FromQuery] string code)
        {

            string url = $"{authOptions.Concept2APIUrl}oauth/access_token";

            FormUrlEncodedContent body = new FormUrlEncodedContent(new Dictionary<string, string>() {
                { "client_id", _config["client_id"]},
                { "client_secret", _config["client_secret"]},
                {"code", code },
                {"grant_type", authOptions.GrantType },
                {"scope", authOptions.Scope },
                {"redirect_uri", authOptions.RedirectURI }


            });

            HttpResponseMessage response = client.PostAsync(url, body).Result;

            if (!response.IsSuccessStatusCode) throw new BadHttpRequestException("Failed to authenticate user");

            string content = response.Content.ReadAsStringAsync().Result;
            AccessToken accessToken = JsonConvert.DeserializeObject<AccessToken>(content);

            //TODO: redir back to react front end
            return Redirect($"../logbook");
        }
    }
}
