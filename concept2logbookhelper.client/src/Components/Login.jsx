import { useNavigate } from 'react-router-dom'
import ResultGraph from './Visualisations/ResultGraph.jsx'

const exampleWorkouts = [
    { date: '2026-11-17', time_formatted: '10:25', average_pace: 125, pretty_average_pace: '2:05.0' },
    { date: '2026-11-10', time_formatted: '10:35', average_pace: 127, pretty_average_pace: '2:07.0' },
    { date: '2026-11-03', time_formatted: '10:50', average_pace: 130, pretty_average_pace: '2:10.0' },
].map(workout => ({ ...workout, pretty_workout_type: 'Fixed distance', total_distance: 2500 }));

function Login() {
    const navigate = useNavigate();

  return (
      <main className="login-page">
          <header className="brand">
              <img src="/assets/icon.svg" alt="" />
              Logbook Helper
          </header>
          <div className="login-content">
              <section className="login-intro">
                  <h1>Compare your Concept2 workouts</h1>
                  <p>Find similar sessions in your logbook and see how your pace has changed over time.</p>
                  <button onClick={Login}>Sign in with Concept2</button>
                  <p className="login-note">Sign in on Concept2 to give Logbook Helper access to your workout history.</p>
              </section>
              <section className="login-example" aria-labelledby="login-example-title">
                  <h2 id="login-example-title">Comparing 2,500 m rows</h2>
                  <p>Filter by distance and workout type to compare sessions like these.</p>
                  <table>
                      <caption>Example workouts</caption>
                      <thead>
                          <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Time</th>
                              <th scope="col">Pace / 500 m</th>
                          </tr>
                      </thead>
                      <tbody>
                          {exampleWorkouts.map(workout => (
                              <tr key={workout.date}>
                                  <td>{Number(workout.date.slice(-2))} Nov</td>
                                  <td>{workout.time_formatted}</td>
                                  <td>{workout.pretty_average_pace}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <figure className="login-graph">
                      <figcaption>Average pace per 500 m over time</figcaption>
                      <div className="login-graph-chart">
                          <ResultGraph resultsInView={exampleWorkouts} compact />
                      </div>
                  </figure>
                  <p className="login-note">You can also filter by date, time, pace, stroke rate, calories and heart rate.</p>
              </section>
          </div>
          <div className="login-details">
              <section aria-labelledby="login-privacy-title">
                  <h2 id="login-privacy-title">Privacy</h2>
                  <p>You enter your password on Concept2’s website. If you approve the connection, Concept2 gives Logbook Helper tokens it uses to fetch your workouts.</p>
                  <p>Logbook Helper fetches your workouts on demand and doesn’t keep a copy of your workout history. Your browser keeps a session cookie, and the app caches the tokens until they expire or you sign out. Signing out clears the cookie and removes the cached tokens.</p>
              </section>
              <section aria-labelledby="login-why-title">
                  <h2 id="login-why-title">Why I built Logbook Helper</h2>
                  <p>I wanted to find similar rows in my own Concept2 logbook and see whether I was getting faster. I built Logbook Helper to make that easier and to learn React along the way.</p>
              </section>
          </div>
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
