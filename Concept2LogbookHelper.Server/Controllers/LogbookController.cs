using Concept2LogbookHelper.Server.Extensions;
using Concept2LogbookHelper.Server.Models.Concept2;
using Concept2LogbookHelper.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

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

        [HttpGet("heart-rate-profile")]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public async Task<IActionResult> GetHeartRateProfile(CancellationToken cancellationToken)
        {
            try
            {
                return await RunZoneRequest(async () => Ok(new
                {
                    maxHeartRate = await _concept2APIService.GetProfileMaxHeartRate(User.GetSessionId(), cancellationToken)
                }), isProfile: true);
            }
            catch (KeyNotFoundException)
            {
                return Unauthorized();
            }
        }

        [HttpPost("heart-rate-zones")]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public Task<IActionResult> GetHeartRateZones(HeartRateZoneRequest workout, CancellationToken cancellationToken)
        {
            if (workout.IntervalWorkTimes.Any(time => time <= 0))
                return Task.FromResult<IActionResult>(BadRequest());

            return RunZoneRequest(async () =>
            {
                var totals = await _concept2APIService.GetHeartRateZones(User.GetSessionId(), workout, cancellationToken);
                return totals is null ? NoContent() : Ok(totals);
            });
        }

        private async Task<IActionResult> RunZoneRequest(Func<Task<IActionResult>> run, bool isProfile = false)
        {
            try
            {
                return await run();
            }
            catch (StrokeThrottledException error)
            {
                Response.Headers.RetryAfter = Math.Max(1,
                    error.RetryAt - DateTimeOffset.UtcNow.ToUnixTimeSeconds()).ToString();
                return StatusCode(StatusCodes.Status429TooManyRequests);
            }
            catch (InvalidOperationException)
            {
                return Conflict();
            }
            catch (HttpRequestException error) when (isProfile &&
                error.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }
            catch (Exception error) when (error is HttpRequestException or Newtonsoft.Json.JsonException ||
                error is OperationCanceledException && !HttpContext.RequestAborted.IsCancellationRequested)
            {
                return StatusCode(StatusCodes.Status502BadGateway);
            }
        }
    }
}
