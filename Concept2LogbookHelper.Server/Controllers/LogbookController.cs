using Concept2LogbookHelper.Server.Extensions;
using Concept2LogbookHelper.Server.Models.Concept2;
using Concept2LogbookHelper.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Concept2LogbookHelper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LogbookController : ControllerBase
    {
        IConcept2APIService _concept2APIService;
        ISessionService _sessionService;

        public LogbookController(IConcept2APIService concept2APIService, ISessionService sessionService)
        {
            this._concept2APIService = concept2APIService;
            this._sessionService = sessionService;
        }

        [HttpGet]
        [Route("GetResults")]
        public async Task<List<Result>> GetResults()
        {
            string sessionId = User.GetSessionId();

            return await _concept2APIService.GetAllResults(sessionId);
        }

        [HttpGet]
        [Route("GetResultsPaged")]
        public async Task<GetResults?> GetResultsPaged([FromQuery] int size, [FromQuery] int page = 1)
        {
            string sessionId = User.GetSessionId();
            var accessToken = await _sessionService.GetStoredAccessTokenAsync(sessionId);
            return await _concept2APIService.GetResults(accessToken, page, size);
        }
    }
}
