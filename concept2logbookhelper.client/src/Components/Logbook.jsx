import ResultsTable from "./ResultsTable";
import "../css/Logbook.css";

function Logbook() {

    return (
        <div>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>

            <h1 className='logTitle'>Logbook</h1>
            <hr></hr>
            <ResultsTable></ResultsTable>
      </div>
    );
}

export default Logbook;