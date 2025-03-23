import { useEffect, useState, useRef, Suspense } from "react";
import { useNavigate } from 'react-router-dom'
import Result from "./Result";
import "../css/ResultsTable.css";
import ResultTableHeader from "./ResultTableHeader";
import FilterButtonList from "./FilterButtonList";
import FilterComparisons from "./FilterComparisons";
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext.js';
import { SortCallbackContext } from '../Contexts/SortCallbackContext.js';
import TimeInput from "./FilterInputs/TimeInput";
import DistanceInput from "./FilterInputs/DistanceInput";
import NumericInput from "./FilterInputs/NumericInput";
import PaceInput from "./FilterInputs/PaceInput";
import DateInput from "./FilterInputs/DateInput";
import Loading from "./Loading";
import ErrorDialog from "./ErrorDialog";
import ResultTableTopMenu from "./ResultTableTopMenu";

function ResultsTable() {
    const [resultsToDisplay, setResultsToDisplay] = useState();
    const [loading, setLoading] = useState(true);
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const [fullResults, setFullResults] = useState(undefined);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);

    const navigate = useNavigate();
    const workoutTypesUnique = useRef([]);
    const filterMap = useRef(new Map());

    const sortFunction = useRef(undefined);

    useEffect(() => {
        var controller = new AbortController();
        populateTotalResults(controller);
        return () => {
            controller.abort();
            setFullResults(fr => undefined);
        };
    }, []);

    useEffect(() => {
        ApplyAllFilters();


        workoutTypesUnique.current = GetUniqueWorkoutTypes(fullResults);

        return () => {
            setResultsToDisplay(rs => undefined);
        };
    }, [fullResults]);

    return (
        <div className='results-table'>
            <ErrorDialog open={openErrorDialog} message={"There was an error fetching workout data."} setOpen={setOpenErrorDialog} />
            {loading ? <Loading /> : <>
                <ResultTableTopMenu fullResults={fullResults} loading={fullyLoaded} filterMap={filterMap.current} sortFunction={sortFunction} applyFilters={ApplyAllFilters} />

                <FilterCallbackContext.Provider value={Filter}>
                    <table>
                        <thead>
                            <SortCallbackContext.Provider value={SetSort}>
                                <tr>
                                    <ResultTableHeader label='Date' ResultPropSelector={(result) => result.date} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={FormatDate} customInput={DateInput} customEqualityFunc={DatesEqual} />} /> 
                                    <ResultTableHeader label='Type' ResultPropSelector={(result) => result.pretty_workout_type} filterMenuContentsComponent={<FilterButtonList filterOptionList={workoutTypesUnique.current} />} />
                                    <ResultTableHeader label='Time' ResultPropSelector={(result) => result.total_time} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => TimeToDeciseconds(value)} customInput={TimeInput} />}/>
                                    <ResultTableHeader label='Distance' ResultPropSelector={(result) => result.distance} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => FormatNumeric(value)} customInput={DistanceInput} />}/>
                                    <ResultTableHeader label='Pace' ResultPropSelector={(result) => result.pretty_average_pace} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => FormatPace(value)} customInput={PaceInput} />} />
                                    <ResultTableHeader label='Avg SPM' ResultPropSelector={(result) => result.stroke_rate} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => FormatNumeric(value)} customInput={NumericInput} />}/>
                                    <ResultTableHeader label='Calories' ResultPropSelector={(result) => result.calories_total} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => FormatNumeric(value)} customInput={NumericInput} />} />
                                    <ResultTableHeader label='Avg HR' ResultPropSelector={(result) => result.heart_rate?.average} filterMenuContentsComponent={<FilterComparisons InputFormatFunc={(value) => FormatNumeric(value)} customInput={NumericInput} />} />
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

    function TimeToDeciseconds(time) {
        if (time === undefined) return undefined;

        var split = FormatTime(time).split(":");
        
        return (split.length > 2 ? split[split.length - 3] * 36000 : 0)
            + split[split.length - 2] * 600 + split[split.length - 1] * 10;
    }

    function FormatTime(input) {
        if (!input.includes(":")) input += ":00";
        if (!input.includes(".")) input += ".0";
        return input;
    }

    function FormatPace(input) {
        if (input === undefined || input === "") return undefined;
        if (!input.includes(":")) input += ":00";
        if (input.charAt(1) === ":") input = "0" + input;
        if (!input.includes(".")) input += ".0";
        return input;
    }

    function FormatDate(input)
    {
        if (input === undefined) return undefined;
        return new Date(input);
    }

    function DatesEqual(a, b) {
        return a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate();
    }
    function FormatNumeric(input) {
        if (input === undefined) return input;
        else return + input
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

    function Filter(ResultPropSelectorFunction, FilterConditionFunction, label, desc) {
        filterMap.current.set(label, {selector: ResultPropSelectorFunction, condition: FilterConditionFunction, desc: desc})

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