import Loading from "./Loading.jsx";
import MobileWarning from "./MobileWarning";
import ActiveFiltersBar from "./ActiveFiltersBar";
import MovablePopup from "./MovablePopup.jsx";
import ResultGraph from "./Visualisations/ResultGraph.jsx";
import WorkoutSummary from "./WorkoutSummary.jsx";
import { useState } from "react";
import '../css/ResultTableTopMenu.css';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';

function ResultTableTopMenu({ fullResults, displayedResults, loading, filterMap, sortFunction, applyFilters, example }) {
    const [isGraphOpen, setIsGraphOpen] = useState(false);
    const navigate = useNavigate();
    const isTouchScreenDevice = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

    return (
        <div className='results-table-topmenu'>
            <MobileWarning />    
            <div className='topmenu-infobar'>
                {!loading || !displayedResults ? <Loading /> : (
                    <WorkoutSummary results={displayedResults} totalCount={fullResults.length}
                        filtered={filterMap.size > 0} dateRange={filterMap.get('Date')?.dateRange} />
                )}
                <div className="table-toolbar">
                    <ActiveFiltersBar filterMap={filterMap} sortFunction={sortFunction} applyFilters={applyFilters} />
                    <div className="table-actions">
                        <button onClick={OpenGraph}>View Graph</button>
                        <button className="secondary-button" onClick={Export}>Export CSV</button>
                    </div>
                </div>
            </div>
            <MovablePopup isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} title={"Results"}>
                {displayedResults?.length ? (
                    <ResultGraph resultsInView={displayedResults} />
                ) : <p className="graph-empty">No results to display.</p>}
            </MovablePopup>
        </div>
    );

    function OpenGraph() {
        if (isTouchScreenDevice) {
            navigate(example ? "/example/graph" : "/graph", { state: { results: displayedResults } });
        } else {
            setIsGraphOpen(true);
        }
    }

    function Export() {
        let csvContent = "Date,Type,Distance,Time,Pace,SPM,Calories,HR\n";

        csvContent += (displayedResults ?? []).map(x => moment(x.date).format('YYYY-MM-DD HH:mm') + "," + x.pretty_workout_type + "," + x.distance + "," + x.time_formatted + "," + x.pretty_average_pace + "," + x.stroke_rate + "," + x.calories_total + "," + x.heart_rate?.average).join("\n");

        // Create a Blob from the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', example ? 'example_workouts.csv' : 'workout_data.csv');
        link.style.visibility = 'hidden';

        // Append to body, click, and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(url);

    //    var encodedUri = encodeURI(csvContent);
    //    window.open(encodedUri);
    }
}

export default ResultTableTopMenu;
