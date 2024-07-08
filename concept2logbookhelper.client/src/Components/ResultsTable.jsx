import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import "./ResultsTable.css";
import ResultTableHeader from "./ResultTableHeader";
import FilterButtonList from "./FilterButtonList";
import FilterComparisons from "./FilterComparisons";

function ResultsTable() {
    const [resultsJsx, setResultsJsx] = useState();
    const [maxHR, setMaxHR] = useState(0);
    const [totalM, setTotalM] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    const workoutTypesUnique = useRef([]);
    const fullResults = useRef([]);

    useEffect(() => { populateTotalResults() }, []);

    return (
        <div>
            <p>Total Workouts: {totalResults} | Total Meters: {totalM}m | Max HR: {maxHR}</p>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <ResultTableHeader label='Type' filterMenuContentsComponent={<FilterButtonList filterOptionList={workoutTypesUnique.current} filterResultsCallback={FilterButton} filterCallback={FilterButton} />} />
                        <th>Time</th>
                        <ResultTableHeader label='Distance' filterMenuContentsComponent={<FilterComparisons filterResultsCallback={FilterButton} />} filterCallback={FilterButton} />
                        <th>Pace</th>
                        <th>Avg SPM</th>
                        <th>Calories</th>
                        <th>Avg HR</th>
                        <th>Link</th>
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

        setTotalResults(fullResults.current.length);
        setTotalM(fullResults.current.reduce((a, c) => a + c.distance, 0));

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

    function FilterButton(value, exact) {
        var filtered = [];
        if (value === '*') {
            filtered = fullResults.current;
        } else if (exact) {
            filtered = fullResults.current.filter(result => result.pretty_workout_type === value);
        } else {
            filtered = fullResults.current.filter(result => result.pretty_workout_type.toLowerCase().indexOf(value.toLowerCase()) !== -1);
        }
        PopulateResultTable(filtered);
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
                avg_hr={result.heart_rate?.average}
                link={BuildResultUrl(result)}
            />
        )));
    }


    function BuildResultUrl(result) {
        return 'https://log.concept2.com/profile/' + result.user_id + '/log/' + result.id;
    }
}

export default ResultsTable;