using System.Security.Claims;

namespace Concept2LogbookHelper.Server.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetSessionId(this ClaimsPrincipal User) => User.Identity?.Name ?? throw new InvalidOperationException("No valid session Id");
    }
}
