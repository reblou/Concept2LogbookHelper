import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import "./ResultsTable.css";
import ResultTableHeader from "./ResultTableHeader";

function ResultsTable() {
    const [resultsJsx, setResultsJsx] = useState();
    const [maxHR, setMaxHR] = useState(0);

    const workoutTypesUnique = useRef([]);
    const fullResults = useRef([]);

    useEffect(() => { populateTotalResults() }, []);

    return (
        <div>
            <p>Max HR: {maxHR}</p>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <ResultTableHeader label='Type' filterMenuItems={workoutTypesUnique.current} filterCallback={FilterButton} />
                        <th>Time</th>
                        <th>Distance</th>
                        <th>Pace</th>
                        <th>Avg SPM</th>
                        <th>Calories</th>
                        <th>Avg HR</th>
                    </tr>
                </thead>
                <tbody>
                    {resultsJsx}
                </tbody>
            </table>
      </div>
    );



    async function populateTotalResults() {
        let response = await fetch("api/logbook/getresults")
        let data = await response.json();
        fullResults.current = data;

        workoutTypesUnique.current = GetUniqueWorkoutTypes(data);

        PopulateResultTable(data);
        setMaxHR(GetMaxHR());
    }

    function GetUniqueWorkoutTypes(results) {
        var map = results.map(result => result.pretty_workout_type).reduce(function (accumulator, currentValue) {
            accumulator[currentValue] = (accumulator[currentValue] || 0) + 1;
            return accumulator;
        }, {});

        return Object.keys(map).sort(function (a, b) {
            return map[b] - map[a];
        })
    }

    function GetMaxHR() {

        var maxs = fullResults.current.map(result => result.heart_rate?.max ?? 0);
        return Math.max(maxs.reduce((a, b) => Math.max(a, b), -Infinity));
    }

    function FilterButton(value) {
        if (value === '*') {
            PopulateResultTable(fullResults.current);
        } else {
            let filtered = fullResults.current.filter(result => result.pretty_workout_type === value);
            PopulateResultTable(filtered);
        }
    }

    function PopulateResultTable(results) {
        setResultsJsx(results.map((result) => (
            <Result key={result.id}
                date={result.date}
                type_pretty={result.pretty_workout_type}
                type={result.workout_type}
                distance={result.distance}
                time={result.time_formatted}
                pace={result.pretty_average_pace}
                spm={result.stroke_rate}
                calories={result.calories_total}
                avg_hr={result.heart_rate?.average }
            />
        )));
    }

}

export default ResultsTable;