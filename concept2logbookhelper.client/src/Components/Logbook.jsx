import ResultsTable from "./ResultsTable";
import { useNavigate } from 'react-router-dom';
import "../css/Logbook.css";

function Logbook() {
    const navigate = useNavigate();

    return (
        <main className="logbook-container">
            <header className="header">
                <span className="brand"><img src="/assets/icon.svg" alt="" /> Logbook Helper</span>
                <button className="secondary-button" onClick={LogOut}>Log Out</button>
            </header>
            <h1 className="logTitle">Logbook</h1>
            <ResultsTable />
        </main>
    );

    async function LogOut() {
        await fetch("api/authentication/logout");

        navigate('/')
    }
}

export default Logbook;
