import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import "./ResultsTable.css";
import FilterList from "./FilterList";

function ResultsTable() {
    const [resultsJsx, setResultsJsx] = useState();
    const [workoutTypesJsx, setWorkoutTypesJsx] = useState();
    const workoutTypesUnique = useRef([]);
    const fullResults = useRef([]);

    useEffect(() => { populateTotalResults() }, []);


    return (
        <div>
            {workoutTypesJsx}
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
                    {resultsJsx}
                </tbody>
            </table>
      </div>
    );



    async function populateTotalResults() {
        let response = await fetch("api/logbook/getresults")
        let data = await response.json();
        fullResults.current = data;

        data.forEach(GetUniqueWorkoutTypes);
        setWorkoutTypesJsx(<FilterList filterOptionList={workoutTypesUnique.current} onClick={FilterButton} />);

        PopulateResultTable(data);
    }

    function GetUniqueWorkoutTypes(result)
    {
        if (workoutTypesUnique.current.indexOf(result.pretty_workout_type) === -1) {
            workoutTypesUnique.current.push(result.pretty_workout_type)
        }
    }

    function FilterButton(value) {
        if (value === '*') {
            PopulateResultTable(fullResults.current);
        } else {
            let filtered = fullResults.current.filter(result => result.pretty_workout_type === value);
            PopulateResultTable(filtered);
        }
        
    }

    function PopulateResultTable(results)
    {
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
            />
        )));
    }

}

export default ResultsTable;