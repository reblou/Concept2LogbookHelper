import ResultsTable from "./ResultsTable";
import { useNavigate } from 'react-router-dom'
import "../css/Logbook.css";

function Logbook() {
    const navigate = useNavigate();

    return (
        <div className='logbook-container'>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <div className='header'>
                <button className='logout-button' onClick={LogOut}>Log Out</button>
                <h1 className='logTitle'>Logbook</h1>
            </div>
            <hr></hr>
            <ResultsTable></ResultsTable>
      </div>
    );

    function LogOut() {
        //TODO: call api to clear session cookie

        navigate('/')
    }
}

export default Logbook;