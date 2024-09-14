using Concept2LogbookHelper.Server.Models;
using Concept2LogbookHelper.Server.Models.Concept2;

namespace Concept2LogbookHelper.Server.Services
{
    public interface IConcept2APIService
    {
        Task<AccessToken> GetAccessTokenGrant(string code, string? redirectUrl = null);
        Task<int> GetNumberOfResults(string sessionId);
        Task<List<Result>> GetAllResults(string sessionId);
        Task<AccessToken> GetAccessTokenRefreshGrant(string refreshToken);
    }
}