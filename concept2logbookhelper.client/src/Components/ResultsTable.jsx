import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import "./ResultsTable.css";
import ResultTableHeader from "./ResultTableHeader";
import FilterButtonList from "./FilterButtonList";
import FilterComparisons from "./FilterComparisons";

import { FilterCallbackContext } from '../Contexts/FilterCallbackContext.js';
import { SortCallbackContext } from '../Contexts/SortCallbackContext.js';

function ResultsTable() {
    const [resultsToDisplay, setResultsToDisplay] = useState();

    const workoutTypesUnique = useRef([]);
    const fullResults = useRef([]);
    const filterMap = useRef(new Map());
    const sortToggle = useRef(false);

    const maxHR = Math.max(
        fullResults.current?.map(result => result.heart_rate?.max ?? 0)
            ?.reduce((a, b) => Math.max(a, b), 0)) || 0;

    const totalMeters = fullResults.current?.reduce((a, c) => a + c.distance, 0) ?? 0
    const totalResults = fullResults.current?.length ?? 0;

    useEffect(() => { populateTotalResults() }, []);

    return (
        <div>
            <p>Total Workouts: {totalResults} | Total Meters: {totalMeters}m | Max HR: {maxHR}</p>
            <button onClick={() => { filterMap.current.clear(); ApplyAllFilters(); }}>Clear All Filters</button>
            <FilterCallbackContext.Provider value={Filter}>
                <table>
                    <thead>
                        <SortCallbackContext.Provider value={Sort }>
                            <tr>
                                <ResultTableHeader label='Date' ResultPropSelector={(result) => result.date} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => + value} />} />
                                <ResultTableHeader label='Type' ResultPropSelector={(result) => result.pretty_workout_type} filterMenuContentsComponent={<FilterButtonList filterOptionList={workoutTypesUnique.current} />}/>
                                <ResultTableHeader label='Time' ResultPropSelector={(result) => TimeToDeciseconds(result.time_formatted)} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => TimeToDeciseconds(value)} />} />
                                <ResultTableHeader label='Distance' ResultPropSelector={(result) => result.distance} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => + value} />}/>
                                <ResultTableHeader label='Pace' ResultPropSelector={(result) => result.pretty_average_pace} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => value} />} />
                                <ResultTableHeader label='Avg SPM' ResultPropSelector={(result) => result.stroke_rate} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => + value} />} /> 
                                <ResultTableHeader label='Calories' ResultPropSelector={(result) => result.calories_total} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => + value} />} />
                                <ResultTableHeader label='Avg HR' ResultPropSelector={(result) => result.heart_rate?.average} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={ (value) => + value} />} />
                                <th>Link</th>
                                </tr>
                        </SortCallbackContext.Provider>
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
            </FilterCallbackContext.Provider>
     </div>
    );

    async function populateTotalResults() {
        let response = await fetch("api/logbook/getresults")
        let data = await response.json();
        workoutTypesUnique.current = GetUniqueWorkoutTypes(data);
        fullResults.current = data;
        setResultsToDisplay(data);
    }

    function TimeToDeciseconds(time) {
        var split = time.split(":");
        
        return (split.length > 2 ? split[split.length -3] * 36000: 0)
            + split[split.length -2] * 600 + split[split.length-1] * 10
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

    function Sort(ResultPropSelectorFunction) {
        sortToggle.current = !sortToggle.current;
        setResultsToDisplay(resultsToDisplay.toSorted((a, b) =>
            PropComparer(ResultPropSelectorFunction(a), ResultPropSelectorFunction(b), sortToggle.current)
        ));

    }

    function PropComparer(a, b, asc) {
        if (a === b) return NaN;

        var bool = asc ?
            a > b :
            b > a
        return bool ? 1 : -1;
    }

    function Filter(ResultPropSelectorFunction, FilterConditionFunction, label) {
        filterMap.current.set(label, {selector: ResultPropSelectorFunction, condition: FilterConditionFunction})

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