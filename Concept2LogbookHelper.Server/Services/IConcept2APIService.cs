using Concept2LogbookHelper.Server.Models;
using Concept2LogbookHelper.Server.Models.Concept2;

namespace Concept2LogbookHelper.Server.Services
{
    public interface IConcept2APIService
    {
        Task<AccessToken> GetAccessTokenGrant(string accessCode);
        Task<int> GetNumberOfResults(string sessionId);
        Task<List<Result>> GetAllResults(string sessionId);
    }
}