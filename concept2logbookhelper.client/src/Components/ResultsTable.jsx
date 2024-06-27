import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import "./ResultsTable.css";

function ResultsTable() {
    const [resultsJsx, setResultsJsx] = useState();
    const [workoutTypesJsx, setWorkoutTypesJsx] = useState();
    const workoutTypes = useRef([]);
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

        data.forEach(GetUniqueWorkoutTypes);
        setWorkoutTypesJsx(workoutTypes.current.map((value) => (<button key={value} onClick={() => FilterButton(value)}>{value}</button>)))
        fullResults.current = data;

        let jsx = data.map((result) => (
            <Result key={result.id}
                date={result.date}
                type_pretty={result.pretty_workout_type}
                type={result.workout_type }
                distance={result.distance}
                time={result.time_formatted}
                pace={result.pretty_average_pace}
                spm={result.stroke_rate}
                calories={result.calories_total}
            />
        ));

        setResultsJsx(jsx);
    }

    function GetUniqueWorkoutTypes(result)
    {
        if (workoutTypes.current.indexOf(result.pretty_workout_type) === -1) {
            workoutTypes.current.push(result.pretty_workout_type)
        }
    }

    function FilterButton(value) {

        let filtered = fullResults.current.filter(result => result.pretty_workout_type === value);
        let jsx = filtered.map((result) => (
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
        ));


        setResultsJsx(jsx);
    }


}

export default ResultsTable;