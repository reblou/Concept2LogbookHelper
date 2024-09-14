using Concept2LogbookHelper.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using System.Web;
using Concept2LogbookHelper.Extensions;
using Microsoft.Extensions.Caching.Distributed;
using Concept2LogbookHelper.Server.Services;
using System.ComponentModel;
using static System.Net.WebRequestMethods;

namespace Concept2LogbookHelper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISessionService _sessionService;
        private readonly IConcept2APIService _concept2APIService;

        public AuthenticationController(IConfiguration config, ISessionService authService, IConcept2APIService concept2APIService)
        {
            _config = config;
            _sessionService = authService;
            _concept2APIService = concept2APIService;
        }

        [HttpGet]
        public async Task<StatusCodeResult> GetSessionId([FromQuery] string code, [FromQuery] bool dummy=false)
        {
            string? redirect = null;
            string? sessionId = null;

            if (dummy)
            {
                redirect = _config["Authentication:DummyRedirectURI"];
                sessionId = _config["Authentication:DummySessionId"];
            }

            AccessToken accessToken = await _concept2APIService.GetAccessTokenGrant(code, redirect);

            string sessionID = await _sessionService.StoreNewAccessToken(accessToken.access_token, accessToken.refresh_token, 
                accessToken.expires_in, sessionID: sessionId);

            Response.Headers.Append("Set-Cookie", $"session-id={sessionID}; Secure; HttpOnly; Expires={DateTime.Now.AddMonths(1).ToString("ddd, dd MMM, yyyy HH:mm:ss G'M'T")}; Path=/api");

            return StatusCode(200);
        }

        [HttpGet]
        [Route("redirect")]
        public RedirectResult RedirectToC2Login()
        {
            //TODO: implement Options pattern
            return Redirect($"{_config["Authentication:Concept2APIUrl"]}oauth/authorize?client_id={_config["client_id"]}&scope={_config["Authentication:Scope"]}&response_type=code&redirect_uri={_config["Authentication:RedirectURI"]}");
        }

        [HttpGet]
        [Route("dummyRedirect")]
        public RedirectResult DummyRedirect([FromQuery] string pass)
        {
            if (pass != _config["dummy_login_key"]) return Redirect("/");

            return Redirect($"{_config["Authentication:Concept2APIUrl"]}oauth/authorize?client_id={_config["client_id"]}&scope={_config["Authentication:Scope"]}&response_type=code&redirect_uri={_config["Authentication:DummyRedirectURI"]}");
        }

        [HttpGet]
        [Route("validSessionCheck")]
        public async Task<StatusCodeResult> ValidSession()
        {
            string sessionId = Request.Cookies["session-id"] ?? throw new ArgumentException("No valid session ID received");

            try
            {
                var token = await _sessionService.GetStoredAccessToken(sessionId);
                return StatusCode(200);
            } catch (KeyNotFoundException)
            {
                // if no access token stored use refresh Token
                var refreshToken = await _sessionService.GetStoredRefreshToken(sessionId);

                //TODO: if this goes wrong, delete refresh token user has to log in again
                var accessToken = await _concept2APIService.GetAccessTokenRefreshGrant(refreshToken);

                await _sessionService.StoreNewAccessToken(accessToken.access_token, accessToken.refresh_token, accessToken.expires_in, sessionId);
                return StatusCode(200);
            }
        }

        [HttpGet]
        [Route("logout")]
        public async Task<StatusCodeResult> LogOut()
        {
            var sessionId = Request.Cookies["session-id"] ?? throw new ArgumentException("No valid session ID received");

            Response.Headers.Append("Set-Cookie", $"session-id=\"\"; Secure; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/api");

            // don't delete dummy account tokens
            if(sessionId != _config["Authentication:DummySessionId"])
                await _sessionService.LogOut(sessionId);

            return StatusCode(200);
        }

        [HttpGet]
        [Route("dummyLogIn")]
        public async Task<StatusCodeResult> DummyLogIn()
        {
            string sessionId = _config["Authentication:DummySessionId"] ?? throw new InvalidOperationException("Configured session ID for dummy account not found.");

            try
            {
                var token = await _sessionService.GetStoredAccessToken(sessionId);

                Response.Headers.Append("Set-Cookie", $"session-id={sessionId}; Secure; HttpOnly; Expires={DateTime.Now.AddMonths(1).ToString("ddd, dd MMM, yyyy HH:mm:ss G'M'T")}; Path=/api");

                return StatusCode(200);
            }
            catch (KeyNotFoundException)
            {
                // if no access token stored  use refresh Token
                var refreshToken = await _sessionService.GetStoredRefreshToken(sessionId);

                //TODO: if this fails, somethings gone super wrong and the refresh token is now invalid, dummy account needs to be logged into again.
                var accessToken = await _concept2APIService.GetAccessTokenRefreshGrant(refreshToken);

                await _sessionService.StoreNewAccessToken(accessToken.access_token, accessToken.refresh_token, accessToken.expires_in, sessionId, 365);
                Response.Headers.Append("Set-Cookie", $"session-id={sessionId}; Secure; HttpOnly; Expires={DateTime.Now.AddMonths(1).ToString("ddd, dd MMM, yyyy HH:mm:ss G'M'T")}; Path=/api");

                return StatusCode(200);
            }
        }
    }

}
