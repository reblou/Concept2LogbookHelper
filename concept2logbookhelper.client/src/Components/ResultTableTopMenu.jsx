import Loading from "./Loading.jsx";
import MobileWarning from "./MobileWarning";
import ActiveFiltersBar from "./ActiveFiltersBar";
import MovablePopup from "./MovablePopup.jsx";
import ResultGraph from "./Visualisations/ResultGraph.jsx";
import { useState } from "react";
import '../css/ResultTableTopMenu.css';

function ResultTableTopMenu({ fullResults, displayedResults, loading, filterMap, sortFunction, applyFilters }) {
    const [isGraphOpen, setIsGraphOpen] = useState(false);
    const maxHR = Math.max(
        fullResults?.map(result => result.heart_rate?.max ?? 0)
            ?.reduce((a, b) => Math.max(a, b), 0)) || 'N/A';

    return (
        <div className='results-table-topmenu'>
            <MobileWarning />    
            <div className='topmenu-infobar'>
				{!loading ?       
					<Loading/> : <>     
						<p> Total Workouts: {fullResults?.length} | Total Meters: {fullResults?.reduce((a, c) => a + c.total_distance, 0)} m | Max HR: {maxHR}</p>
					</>}
				<button onClick={() => setIsGraphOpen(true)}>View Graph</button>
			</div>
				<ActiveFiltersBar filterMap={filterMap} sortFunction={sortFunction} applyFilters={applyFilters} />
            <MovablePopup isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} title={"Results"}>
                <ResultGraph resultsInView={displayedResults} />
            </MovablePopup>
        </div>
    );
}

export default ResultTableTopMenu;