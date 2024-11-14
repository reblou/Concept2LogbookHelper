using Concept2LogbookHelper.Server.Models.Concept2;
using Concept2LogbookHelper.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace Concept2LogbookHelper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogbookController : ControllerBase
    {
        IConcept2APIService _concept2APIService;
        ISessionService _sessionService;

        public LogbookController(IConcept2APIService concept2APIService, ISessionService sessionService)
        {
            this._concept2APIService = concept2APIService;
            this._sessionService = sessionService;
        }

        private string GetSessionId()
        {
            return Request.Cookies["session-id"] ?? throw new KeyNotFoundException("No valid session ID received");
        }

        [HttpGet]
        [Route("GetResults")]
        public async Task<List<Result>> GetResults()
        {
            string sessionId = GetSessionId();

            return await _concept2APIService.GetAllResults(sessionId);
        }

        [HttpGet]
        [Route("GetResultsPaged")]
        public async Task<GetResults?> GetResultsPaged([FromQuery] int size, [FromQuery] int page = 1)
        {
            try
            {
                var accessToken = await _sessionService.GetStoredAccessToken(GetSessionId());
                return await _concept2APIService.GetResults(accessToken, page, size);
            } catch(KeyNotFoundException)
            {
                //access token has expired or we don't have a session Id
                this.HttpContext.Response.StatusCode = 401;
                return null;
            }
        }
    }
}
