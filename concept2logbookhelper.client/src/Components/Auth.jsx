import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Auth() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => { getSessionId(); }, [])

    return (
        null
    );

    async function getSessionId() {
        var code = searchParams.get("code");

        await fetch("api/authentication?" + new URLSearchParams({ code: code }));

        navigate("/logbook")
    }

}

export default Auth;