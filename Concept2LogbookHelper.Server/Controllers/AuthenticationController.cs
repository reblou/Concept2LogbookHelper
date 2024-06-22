﻿using Concept2LogbookHelper.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Net.Http.Formatting;
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
        private readonly ISessionService _authenticationService;
        private readonly IConcept2APIService _concept2APIService;

        public AuthenticationController(IConfiguration config, ISessionService authService, IConcept2APIService concept2APIService)
        {
            _config = config;
            _authenticationService = authService;
            _concept2APIService = concept2APIService;
        }

        [HttpGet]
        [Route("redirect")]
        public RedirectResult RedirectToC2Login()
        {
            //TODO: implement Options pattern
            return Redirect($"{_config["Authentication:Concept2APIUrl"]}oauth/authorize?client_id={_config["client_id"]}&scope={_config["Authentication:Scope"]}&response_type={_config["Authentication:ResponseType"]}&redirect_uri={_config["Authentication:RedirectURI"]}");
        }

        [HttpGet]
        public async Task<StatusCodeResult> GetSessionId([FromQuery] string code)
        { 
            AccessToken accessToken = await _concept2APIService.GetAccessToken(code);

            string sessionID = await _authenticationService.StoreNewAccessToken(accessToken.access_token, accessToken.refresh_token, accessToken.expires_in);

            Response.Headers.Append("Set-Cookie", $"session-id={sessionID}; Secure; HttpOnly; Expires={DateTime.Now.AddMonths(6).ToString("ddd, dd MMM, yyyy HH:mm:ss G'M'T")}");

            return StatusCode(200);
        }
    }
}
