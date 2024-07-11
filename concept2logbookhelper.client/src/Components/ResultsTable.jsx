import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import "./ResultsTable.css";
import ResultTableHeader from "./ResultTableHeader";
import FilterButtonList from "./FilterButtonList";
import FilterComparisons from "./FilterComparisons";

import { FilterCallbackContext } from '../Contexts/FilterCallbackContext.js';

function ResultsTable() {
    const [resultsToDisplay, setResultsToDisplay] = useState();

    const workoutTypesUnique = useRef([]);
    const fullResults = useRef([]);
    const filterMap = useRef(new Map());

    const maxHR = Math.max(
        fullResults.current?.map(result => result.heart_rate?.max ?? 0)
            ?.reduce((a, b) => Math.max(a, b), 0)) || 0;

    const totalMeters = fullResults.current?.reduce((a, c) => a + c.distance, 0) ?? 0
    const totalResults = fullResults.current?.length ?? 0;

    useEffect(() => { populateTotalResults() }, []);

    return (
        <div>
            <p>Total Workouts: {totalResults} | Total Meters: {totalMeters}m | Max HR: {maxHR}</p>
            <button onClick={() => {filterMap.current.clear(); ApplyAllFilters();}}>Clear All Filters</button>
            <table>

                <thead>
                    <FilterCallbackContext.Provider value={Filter}>
                        <tr>
                            <th>Date</th>
                            <ResultTableHeader label='Type' ResultPropSelector={(result) => result.pretty_workout_type} filterMenuContentsComponent={<FilterButtonList filterOptionList={workoutTypesUnique.current} />}/>
                            <th>Time</th>
                            <ResultTableHeader label='Distance' ResultPropSelector={(result) => result.distance} filterMenuContentsComponent={<FilterComparisons/>}/>
                            <th>Pace</th>
                            <th>Avg SPM</th>
                            <th>Calories</th>
                            <th>Avg HR</th>
                            <th>Link</th>
                        </tr>
                    </FilterCallbackContext.Provider>
                </thead>
                <tbody>
                    {resultsToDisplay?.map((result) => (
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
                            link={'https://log.concept2.com/profile/' + result.user_id + '/log/' + result.id}
                        />
                    ))}
                </tbody>
            </table>
      </div>
    );

    async function populateTotalResults() {
        let response = await fetch("api/logbook/getresults")
        let data = await response.json();
        workoutTypesUnique.current = GetUniqueWorkoutTypes(data);
        fullResults.current = data;
        setResultsToDisplay(data);
    }

    function GetUniqueWorkoutTypes(results) {
        var map = results?.map(result => result.pretty_workout_type).reduce(function (accumulator, currentValue) {
            accumulator[currentValue] = (accumulator[currentValue] || 0) + 1;
            return accumulator;
        }, {});

        return map && Object.keys(map).sort(function (a, b) {
            return map[b] - map[a];
        })
    }

    function Filter(ResultPropSelectorFunction, FilterConditionFunction, label) {
        filterMap.current.set(label, {selector: ResultPropSelectorFunction, condition: FilterConditionFunction})

        //var resultSetToFilter = label === lastFilterSetterColumn ? fullResults.current : resultsToDisplay;
        //setResultsToDisplay(resultSetToFilter.filter(result => FilterConditionFunction(ResultPropSelectorFunction(result))));
        ApplyAllFilters();
    }

    function ApplyAllFilters() {
        var resultSetToFilter = fullResults.current;

        filterMap.current.forEach((value, key) =>
            resultSetToFilter = resultSetToFilter.filter(result => value.condition(value.selector(result)))
        )
        setResultsToDisplay(resultSetToFilter);
    }
}

export default ResultsTable;