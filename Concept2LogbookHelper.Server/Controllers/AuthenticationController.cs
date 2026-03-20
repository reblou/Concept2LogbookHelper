using Concept2LogbookHelper.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Concept2LogbookHelper.Server.Services;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using Concept2LogbookHelper.Server.Extensions;

namespace Concept2LogbookHelper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly IConcept2APIService _concept2APIService;
        private readonly AuthenticationOptions _auth;

        public AuthenticationController(
            IOptions<AuthenticationOptions> _authOptions,
            ISessionService authService,
            IConcept2APIService concept2APIService)
        {
            _sessionService = authService;
            _concept2APIService = concept2APIService;
            _auth = _authOptions.Value;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<StatusCodeResult> GetSessionId([FromQuery] string code)
        {
            // called after log in on c2 page

            AccessToken accessToken = await _concept2APIService.GetAccessTokenGrant(code);

            string sessionID = await _sessionService.StoreNewAccessTokenAsync(accessToken.access_token, accessToken.refresh_token, 
                accessToken.expires_in);

            Response.Headers.Append("Set-Cookie", $"session-id={sessionID}; Secure; HttpOnly; Expires={DateTime.Now.AddMonths(1).ToString("ddd, dd MMM, yyyy HH:mm:ss G'M'T")}; Path=/api");

            return Ok();
        }

        [HttpGet]
        [Route("redirect")]
        [AllowAnonymous]
        public RedirectResult RedirectToC2Login()
        {
            return Redirect($"{_auth.Concept2APIUrl}oauth/authorize?client_id={_auth.client_id}&scope={_auth.Scope}&response_type=code&redirect_uri={_auth.RedirectURI}");
        }

        [HttpGet]
        [Route("validSessionCheck")]
        public StatusCodeResult IsValidSession()
        {
            return Ok();
        }

        [HttpGet]
        [Route("logout")]
        public async Task<StatusCodeResult> LogOut()
        {
            var sessionId = Request.Cookies["session-id"] ?? throw new ArgumentException("No valid session ID received");

            Response.Headers.Append("Set-Cookie", $"session-id=\"\"; Secure; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/api");

            await _sessionService.LogOutAsync(sessionId);

            return Ok();
        }
    }
}
