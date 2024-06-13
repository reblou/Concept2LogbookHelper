namespace Concept2LogbookHelper.Server.Services
{
    public interface IAuthenticationService
    {
        string GetAccessToken(string accessCode);
    }
}