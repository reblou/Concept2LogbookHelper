import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import Result from "./Result";
import "../css/ResultsTable.css";
import ResultTableHeader from "./ResultTableHeader";
import FilterButtonList from "./FilterButtonList";
import FilterComparisons from "./FilterComparisons";
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext.js';
import { SortCallbackContext } from '../Contexts/SortCallbackContext.js';
import { dateKey, parseDuration } from "./filterValues";
import Loading from "./Loading";
import ErrorDialog from "./ErrorDialog";
import ResultTableTopMenu from "./ResultTableTopMenu";

function ResultsTable({ sampleResults }) {
    const example = sampleResults !== undefined;
    const [resultsToDisplay, setResultsToDisplay] = useState(sampleResults);
    const [loading, setLoading] = useState(!example);
    const [fullyLoaded, setFullyLoaded] = useState(example);
    const [fullResults, setFullResults] = useState(sampleResults);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const workoutTypes = useMemo(() => GetUniqueWorkoutTypes(fullResults), [fullResults]);

    const navigate = useNavigate();
    const filterMap = useRef(new Map());

    const sortFunction = useRef(undefined);

    useEffect(() => {
        if (example) return;

        var controller = new AbortController();
        populateTotalResults(controller);
        return () => {
            controller.abort();
            setFullResults(fr => undefined);
        };
    }, [example]);

    useEffect(() => {
        ApplyAllFilters();

        return () => {
            setResultsToDisplay(rs => undefined);
        };
    }, [fullResults]);

    return (
        <div className='results-table'>
            <ErrorDialog open={openErrorDialog} message={"There was an error fetching workout data."} setOpen={setOpenErrorDialog} />
            {loading ? <Loading /> : <>
                <ResultTableTopMenu fullResults={fullResults} displayedResults={resultsToDisplay} loading={fullyLoaded} filterMap={filterMap.current} sortFunction={sortFunction} applyFilters={ApplyAllFilters} example={example} />

                <FilterCallbackContext.Provider value={Filter}>
                    <div className="table-scroll" role="region" aria-label="Workout history" tabIndex={0}>
                    <table>
                        <thead>
                            <SortCallbackContext.Provider value={SetSort}>
                                <tr>
                                    <ResultTableHeader label="Date" ResultPropSelector={result => result.date} filterValue={result => dateKey(result.date)} filterMenuContentsComponent={<FilterComparisons label="Date" kind="date" />} />
                                    <ResultTableHeader label='Type' ResultPropSelector={(result) => result.pretty_workout_type} filterMenuContentsComponent={<FilterButtonList filterOptionList={workoutTypes} />} />
                                    <ResultTableHeader label="Time" ResultPropSelector={result => result.total_time} filterMenuContentsComponent={<FilterComparisons label="Time" kind="time" placeholder="20:00" />} />
                                    <ResultTableHeader label="Distance" ResultPropSelector={result => result.distance} filterMenuContentsComponent={<FilterComparisons label="Distance" unit="m" placeholder="2000" />} />
                                    <ResultTableHeader label="Pace" ResultPropSelector={result => result.pretty_average_pace} filterValue={result => parseDuration(result.pretty_average_pace)} filterMenuContentsComponent={<FilterComparisons label="Pace" kind="pace" unit="/500 m" placeholder="2:05.0" />} />
                                    <ResultTableHeader label="Avg SPM" ResultPropSelector={result => result.stroke_rate} filterMenuContentsComponent={<FilterComparisons label="Avg SPM" unit="spm" placeholder="24" />} />
                                    <ResultTableHeader label="Calories" ResultPropSelector={result => result.calories_total} filterMenuContentsComponent={<FilterComparisons label="Calories" unit="kcal" placeholder="200" />} />
                                    <ResultTableHeader label="Avg HR" ResultPropSelector={result => result.heart_rate?.average} filterMenuContentsComponent={<FilterComparisons label="Avg HR" unit="bpm" placeholder="145" />} />
                                    {!example && <th scope="col">Link</th>}
                                </tr>
                            </SortCallbackContext.Provider>
                        </thead>
                        <tbody>
                            {resultsToDisplay?.length === 0 && (
                                <tr><td colSpan={example ? 8 : 9}>No workouts to display.</td></tr>
                            )}
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
                                    link={example ? undefined : 'https://log.concept2.com/profile/' + result.user_id + '/log/' + result.id}
                                />
                            ))}
                        </tbody>
                    </table>
                    </div>
                </FilterCallbackContext.Provider>
            </>}
     </div>
    );

    async function populateTotalResults(controller) {
        let fetchSize = 20

        try {
            let pagination = await populatePagedResults(controller, fetchSize);

            for (let i = 2; i <= pagination.total_pages; i++) {
                await populatePagedResults(controller, fetchSize, i);
            }
            setFullyLoaded(true);
        } catch ({ name, messsage }) {
            if (name === "AbortError") return; //ignore unmount errors
            
            setOpenErrorDialog(true);
        }
    }

    async function populatePagedResults(controller, fetchSize, page = 1) {
        let response = await fetch("api/logbook/GetResultsPaged?" + new URLSearchParams({ size: fetchSize, page }), { signal: controller.signal });

        if (response.status == 401) {
            navigate('/');
            return;
        }

        let results = await response.json();
        // parse date string to Date objects.
        results.data = results.data.map(r => ({ ...r, date: new Date(r.date)}));

        setFullResults(fr => {
            return fr === undefined ?
                results.data :
                [...fr, ...results.data]
        });

        setLoading(false);
        return results.meta.pagination;
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

    function SetSort(ResultPropSelectorFunction, label) {
        var toggle;

        if (typeof sortFunction.current === "undefined") {
            toggle = true; // true = ascending
        } else {
            toggle = !sortFunction.current.toggle;
        }

        sortFunction.current = {
            func: ((results) => {
                return results.toSorted((a, b) =>
                    PropComparer(ResultPropSelectorFunction(a), ResultPropSelectorFunction(b), sortFunction.current.toggle)
                )
            }),
            label: label,
            toggle: toggle
        };

        setResultsToDisplay(sortFunction.current.func(resultsToDisplay));
    }

    function PropComparer(a, b, asc) {
        if (a === b) return NaN;

        var bool = asc ?
            a > b :
            b > a
        return bool ? 1 : -1;
    }

    function Filter(ResultPropSelectorFunction, FilterConditionFunction, label, desc, dateRange) {
        filterMap.current.set(label, {selector: ResultPropSelectorFunction, condition: FilterConditionFunction, desc, dateRange});

        ApplyAllFilters();
    }

    function ApplyAllFilters() {
        if (fullResults === undefined) {
            setResultsToDisplay(undefined);
        }

        var filteredResults = fullResults;

        filterMap.current.forEach((value) =>
            filteredResults = filteredResults.filter(result => value.condition(value.selector(result)))
        )

        if (sortFunction.current !== undefined && sortFunction !== null) filteredResults = sortFunction.current.func(filteredResults);

        setResultsToDisplay(filteredResults);
    }
}

export default ResultsTable;
