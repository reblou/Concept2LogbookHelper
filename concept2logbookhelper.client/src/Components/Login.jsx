import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate();

  return (
      <div>
          <h1 id="tabelLabel">Logbook Helper</h1>
          <button onClick={Login}>Log In via Concept2</button>
      </div>
    );


    async function Login() {
        // check for valid session ID first
        await fetch('api/authentication/validSessionCheck').then(function (response) {
            if (response.ok) {
               navigate('/logbook')
            } else {
                window.location.replace('api/authentication/redirect');
            }
        })
    }
}

export default Login;