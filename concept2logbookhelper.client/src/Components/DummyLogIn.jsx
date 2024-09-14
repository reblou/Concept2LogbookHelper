import { useState, useContext } from 'react';

function DummyLogIn() {
    const [input, setInput] = useState();

    return (
        <div>
            <input onChange={e => setInput(e.target.value)} ></input>
            <button onClick={Submit} >Submit</button>
        </div>
    );

    async function Submit() {
        window.location.replace(`api/authentication/dummyRedirect?pass=${input}`);
    }
}

export default DummyLogIn;