import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate();

  return (
      <main className="login-card">
          <header className="login-hero">
              <span className="brand"><img src="/assets/icon.svg" alt="" /> Concept2 workout history</span>
              <h1>Logbook Helper</h1>
          </header>
          <section className="login-body">
                  <h2>About</h2>
                  <p>Logbook helper is a web app designed to present your Concept 2 rowing machine workout history in a more useful way.</p>
                  <p>It allows you to filter and sort workouts by date, workout type, time, distance, pace, SPM, calories and heart rate. Making it easy to compare past performance across similar workouts.</p>
                  <button onClick={Login}>Log In via Concept2</button>
          </section>
      </main>
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
}

export default Login;
