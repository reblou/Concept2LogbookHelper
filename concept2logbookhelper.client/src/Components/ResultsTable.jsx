import { useEffect, useState } from "react";
import Result from "./Result";
import "./ResultsTable.css";

function ResultsTable() {
    const [results, setResults] = useState();

    useEffect(() => { populateTotalResults() }, []);


  return (
      <table>
          <thead>
              <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Distance</th>
                  <th>Time</th>
                  <th>Pace</th>
                  <th>Avg HR</th>
              </tr>
          </thead>
          <tbody>
              {results}
          </tbody>
      </table>
    );



    async function populateTotalResults() {
        let response = await fetch("api/logbook/getresults")
        let data = await response.json();

        let jsx = data.map((result) => (
            <Result key={result.id} date={result.date} type={result.workout_type} distance={result.distance} time={result.time_formatted} />
        ));

        setResults(jsx);
    }
}

export default ResultsTable;