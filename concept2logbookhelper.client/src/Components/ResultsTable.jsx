import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import "./ResultsTable.css";

function ResultsTable() {
    const [results, setResults] = useState();
    const workoutTypeColours = useRef({});

    useEffect(() => { populateTotalResults() }, []);


  return (
      <table>
          <thead>
              <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Distance</th>
                  <th>Pace</th>
                  <th>Avg SPM</th>
                  <th>Calories</th>
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
            <Result key={result.id}
                date={result.date}
                type={result.pretty_workout_type}
                distance={result.distance}
                time={result.time_formatted}
                pace={result.pretty_average_pace}
                spm={result.stroke_rate}
                calories={result.calories_total}
                tag_colour={GetTypeColour(result.pretty_workout_type)}
            />
        ));

        setResults(jsx);
    }

    function GetTypeColour(value) {
        if (value in workoutTypeColours === false) {
            workoutTypeColours[value] = RandomColour();
        }
        return workoutTypeColours[value];
    }

    function RandomColour() {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }
}

export default ResultsTable;