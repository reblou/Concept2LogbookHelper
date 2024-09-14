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
        var dummy = searchParams.get("dummy");

        let params = new URLSearchParams({ code: code})

        if (dummy !== null) params.append("dummy", dummy);

        await fetch("api/authentication?" + params);

        navigate("/logbook")
    }

}

export default Auth;