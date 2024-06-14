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

namespace Concept2LogbookHelper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthenticationService _authenticationService;
        private readonly IConcept2APIService _concept2APIService;

        public AuthenticationController(IConfiguration config, IAuthenticationService authService, IConcept2APIService concept2APIService)
        {
            _config = config;
            _authenticationService = authService;
            _concept2APIService = concept2APIService;
        }

        [HttpGet]
        [Route("redirect")]
        public RedirectResult RedirectToC2Login()
        {
            return Redirect($"{_config["Authentication:Concept2APIUrl"]}oauth/authorize?client_id={_config["client_id"]}&scope={_config["Authentication:Scope"]}&response_type={_config["Authentication:ResponseType"]}&redirect_uri={_config["Authentication:RedirectURI"]}");
        }

        [HttpGet]
        public async Task<RedirectResult> GetAccessToken([FromQuery] string code)
        {
            string sessionID = await _authenticationService.GetAndStoreNewAccessToken(code);
            //TODO: redir back to react front end with session ID
            //      front end receive to access code and call fetch here instead? 

            return Redirect($"../logbook");
        }

        [HttpGet]
        public async Task<int> GetTotalResults(string sessionId)
        {
            return await _concept2APIService.GetNumberOfResults(sessionId);
        }
    }
}
