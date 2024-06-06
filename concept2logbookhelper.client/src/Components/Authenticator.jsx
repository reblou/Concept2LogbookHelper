import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Authenticator() {
    const [searchParams, setSearchParams] = useSearchParams();
    const clientID = "L7PKTo4B8fAc2KDTeoqup8V8KGwxlmc37l64OfLS";
    const clientSecret = "";
    const grantType = "authorization_code";
    const scopes = "user:read,results:read";
    const redirectUri = "https://localhost:5173/auth";

    const authCode = searchParams.get("code");

    useEffect(() => {
        GetAccessToken();
    });

    async function GetAccessToken() {
        var params = new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: grantType,
            scope: scopes,
            code: authCode,
            redirect_uri: redirectUri
        }).toString();

        const response = await fetch('https://log.concept2.com/oauth/access_token', {
            method: 'POST', headers: { 'Content-type': 'application/x-www-form-urlencoded' }, body: params })

        const content = await response.json();

        const response2 = await fetch('https://log.concept2.com/api/users/me/results?from=2024-06-01', {
            headers: {
                'content-type': 'application/json', 'Authorization': 'Bearer ' + content.access_token
            }
        });

        var results = await response2.json();
        window.alert(results);
    }

    return (
        <p>{authCode}</p>
    );
}

export default Authenticator;