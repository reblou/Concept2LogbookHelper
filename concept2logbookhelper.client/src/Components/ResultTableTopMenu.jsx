import Loading from "./Loading.jsx";
import MobileWarning from "./MobileWarning";
import ActiveFiltersBar from "./ActiveFiltersBar";
import MovablePopup from "./MovablePopup.jsx";
import ResultGraph from "./Visualisations/ResultGraph.jsx";
import { useState } from "react";
import '../css/ResultTableTopMenu.css';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';

function ResultTableTopMenu({ fullResults, displayedResults, loading, filterMap, sortFunction, applyFilters }) {
    const [isGraphOpen, setIsGraphOpen] = useState(false);
    const maxHR = Math.max(
        fullResults?.map(result => result.heart_rate?.max ?? 0)
            ?.reduce((a, b) => Math.max(a, b), 0)) || 'N/A';
    const navigate = useNavigate();
    const isTouchScreenDevice = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

    return (
        <div className='results-table-topmenu'>
            <MobileWarning />    
            <div className='topmenu-infobar'>
                {!loading ? <Loading /> : (
                    <dl className="workout-summary">
                        <div><dt>Total workouts</dt><dd>{fullResults?.length.toLocaleString()}</dd></div>
                        <div><dt>Total meters</dt><dd>{fullResults?.reduce((total, result) => total + result.total_distance, 0).toLocaleString()} m</dd></div>
                        <div><dt>Max HR</dt><dd>{maxHR}</dd></div>
                    </dl>
                )}
                <div className="table-actions">
                    <button onClick={OpenGraph}>View Graph</button>
                    <button className="secondary-button" onClick={Export}>Export CSV</button>
                </div>
			</div>
				<ActiveFiltersBar filterMap={filterMap} sortFunction={sortFunction} applyFilters={applyFilters} />
            <MovablePopup isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} title={"Results"}>
                {displayedResults?.length ? (
                    <ResultGraph resultsInView={displayedResults} />
                ) : <p className="graph-empty">No results to display.</p>}
            </MovablePopup>
        </div>
    );

    function OpenGraph() {
        if (isTouchScreenDevice) {
            navigate("/graph", { state: { results: displayedResults } } );
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
        link.setAttribute('download', 'workout_data.csv'); // Set your desired filename
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
