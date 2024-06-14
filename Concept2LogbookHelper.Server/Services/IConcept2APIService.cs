using Concept2LogbookHelper.Server.Models;

namespace Concept2LogbookHelper.Server.Services
{
    public interface IConcept2APIService
    {
        Task<AccessToken> GetAccessToken(string accessCode);
        Task<int> GetNumberOfResults(string sessionId);
    }
}