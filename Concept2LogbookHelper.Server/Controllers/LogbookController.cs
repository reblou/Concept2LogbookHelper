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

        public LogbookController(IConcept2APIService concept2APIService)
        {
            this._concept2APIService = concept2APIService;
        }

        private string GetSessionId()
        {
            return Request.Cookies["session-id"] ?? throw new ArgumentException("No valid session ID received");
        }

        [HttpGet]
        [Route("GetResults")]
        public async Task<List<Result>> GetResults()
        {
            string sessionId = GetSessionId();

            return await _concept2APIService.GetResults(sessionId);
        }
    }
}
