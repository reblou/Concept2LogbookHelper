import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate();

  return (
      <div>

          <title>Logbook Helper</title>
          <h1 id="tabelLabel">Logbook Helper</h1>
          <hr />

          <div> 
              <div>
                  <h2>What is Logbook helper?</h2>
                  <p>Logbook helper is a web app designed to present your Concept 2 rowing machine workout history in a more useful way.</p>
                  <p>It allows you to filter and sort workouts by date, workout type, time, distance, pace, SPM, calories and heart rate. Making it easy to compare past performance across similar workouts.</p>
                  <button onClick={Login}>Log In via Concept2</button>
              </div>
              <div>
                <br/>
                <h2>&quot;I don&apos;t have an Concept 2 account&quot;</h2>
                <p>You can play around with some mock data here</p>
                <button onClick={DummyLogin} >View Dummy Account</button>
              </div>
          </div>
      </div>
    );


    async function Login() {
        // check for valid session ID first
        try {
            var response = await fetch('api/authentication/validSessionCheck', { signal: AbortSignal.timeout(50000) })

            if (response.ok) navigate('/logbook');
            else throw new Error("Invalid Session");
        } catch (err) {

            window.location.replace('api/authentication/redirect');
        }
    }

    async function DummyLogin() {
        //TODO: if no access or refresh token stored, flag error message, do not navigate to logbook
        var response = await fetch('api/authentication/dummyLogIn');

        if (response.ok) navigate('/logbook');
    }
}

export default Login;