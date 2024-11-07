import { useState, useContext, useEffect } from 'react';

function DummyLogIn() {
    const [input, setInput] = useState();
    const [accessTokenExists, setAccessTokenExists] = useState(false);
    const [refreshTokenExists, setRefreshTokenExists] = useState(false);
    const [accessTokenExpiry, setAccessTokenExpiry] = useState();
    const [refreshTokenExpiry, setRefreshTokenExpiry] = useState();

    useEffect(() => {
        GetTokenStatus();
    }, []);

    return (
        <div>
            <input onChange={e => setInput(e.target.value)} ></input>
            <button onClick={Submit} >Submit</button>

            <div>            
                <p>Access Token Exists? - {accessTokenExists.toString()}</p>
                {accessTokenExpiry ? <p>Expiry Date: {accessTokenExpiry}</p> : <></>}

                <hr/>

                <p>Refresh Token Exists? - {refreshTokenExists.toString()}</p>
                {refreshTokenExpiry ? <p>Expiry Date: {refreshTokenExpiry}</p> : <></>}
            </div>
        </div>
    );

    async function Submit() {
        window.location.replace(`api/authentication/dummyRedirect?pass=${input}`);
    }

    async function GetTokenStatus() {
        let response = await fetch('api/authentication/dummyTokenCheck');
        let results = await response.json();

        setAccessTokenExists(results.accessTokenExists);
        setRefreshTokenExists(results.refreshTokenExists);

        setAccessTokenExpiry(results.accessExpiryDate);
        setRefreshTokenExpiry(results.refreshExpiryDate);
    }
}

export default DummyLogIn;