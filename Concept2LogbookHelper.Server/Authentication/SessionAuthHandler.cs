using Concept2LogbookHelper.Server.Models;
using Concept2LogbookHelper.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Concept2LogbookHelper.Server.Authentication
{
    public class SessionAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly ISessionService sessionService;
        private readonly IConcept2APIService concept2APIService;

        public SessionAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISessionService sessionService,
            IConcept2APIService concept2APIService) : base(options, logger, encoder)
        {
            this.sessionService = sessionService;
            this.concept2APIService = concept2APIService;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var sessionId = Request.Cookies["session-id"];

            if (sessionId is null)
            {
                return AuthenticateResult.Fail("No Valid SessionId Provided.");
            }

            // throws keynotfound
            string? accessToken = await sessionService.TryGetStoredAccessTokenAsync(sessionId);

            if (accessToken is null)
            {
                // else try to get refresh token and authenticate
                string? refreshToken = await sessionService.TryGetStoredRefreshTokenAsync(sessionId);

                if (refreshToken is null)
                {
                    return AuthenticateResult.Fail("No tokens found for provided session Id.");
                }

                try 
                { 
                    AccessToken tokens = await concept2APIService.GetAccessTokenRefreshGrant(refreshToken);
                    await sessionService.StoreNewAccessTokenAsync(tokens.access_token, tokens.refresh_token, tokens.expires_in, sessionId);
                } catch (Exception e)
                {
                    await sessionService.LogOutAsync(sessionId);
                    return AuthenticateResult.Fail("Unable to use refresh token to regenerate new Access Token.");
                }
            }

            var ticket = BuildAuthTicket(sessionId);
            return AuthenticateResult.Success(ticket);
        }

        private AuthenticationTicket BuildAuthTicket(string sessionId)
        {
            var claims = new[] { new Claim(ClaimTypes.Name, sessionId) };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            return new AuthenticationTicket(principal, Scheme.Name);
        }
    }
}
