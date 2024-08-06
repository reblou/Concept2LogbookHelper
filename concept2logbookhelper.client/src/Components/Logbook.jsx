import ResultsTable from "./ResultsTable";
import "./Logbook.css";

function Logbook() {

    return (
      <div>
      <h1 className='logTitle'>Logbook</h1>
      <hr></hr>
            <ResultsTable></ResultsTable>
      </div>
    );
}

export default Logbook;