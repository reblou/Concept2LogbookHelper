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

namespace Concept2LogbookHelper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IConfiguration config, IAuthenticationService authService)
        {
            _config = config;
            _authenticationService = authService;
        }

        [HttpGet]
        [Route("redirect")]
        public RedirectResult RedirectToC2Login()
        {
            return Redirect($"{_config["Authentication:Concept2APIUrl"]}oauth/authorize?client_id={_config["client_id"]}&scope={_config["Authentication:Scope"]}&response_type={_config["Authentication:ResponseType"]}&redirect_uri={_config["Authentication:RedirectURI"]}");
        }

        [HttpGet]
        public RedirectResult GetAccessToken([FromQuery] string code)
        {
            string sessionID = _authenticationService.GetAccessToken(code);

            //TODO: redir back to react front end with session ID
            return Redirect($"../logbook");
        }
    }
}
