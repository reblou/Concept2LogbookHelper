import ResultsTable from "./ResultsTable";
import { Link, useNavigate } from 'react-router-dom';
import { exampleWorkouts } from './exampleWorkouts.js';
import "../css/Logbook.css";

function Logbook({ example = false }) {
    const navigate = useNavigate();

    return (
        <main className="logbook-container">
            <header className="header">
                <span className="brand"><img src="/assets/logbook-icon.svg" alt="" /> Logbook Helper</span>
                {example ? <Link to="/">Back to home</Link> : (
                    <button className="secondary-button" onClick={LogOut}>Log Out</button>
                )}
            </header>
            <h1 className="logTitle">{example ? 'Example logbook' : 'Logbook'}</h1>
            {example && <p>These are sample workouts. Try filtering Type to 2500m, then select View Graph to compare their pace.</p>}
            <ResultsTable sampleResults={example ? exampleWorkouts : undefined} />
        </main>
    );

    async function LogOut() {
        await fetch("api/authentication/logout");

        navigate('/')
    }
}

export default Logbook;
