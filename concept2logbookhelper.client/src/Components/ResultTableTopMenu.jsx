import Loading from "./Loading.jsx";
import MobileWarning from "./MobileWarning";
import ActiveFiltersBar from "./ActiveFiltersBar";
import MovablePopup from "./MovablePopup.jsx";
import { useState } from "react";

function ResultTableTopMenu({ fullResults, loading, filterMap, sortFunction, applyFilters }) {
    const [isGraphOpen, setIsGraphOpen] = useState(false);
    const maxHR = Math.max(
        fullResults?.map(result => result.heart_rate?.max ?? 0)
            ?.reduce((a, b) => Math.max(a, b), 0)) || 'N/A';

    return (
        <div className='results-table-topmenu'>

            <MobileWarning />    
            {!loading ?       
                <Loading/> : <>     
                    <p> Total Workouts: {fullResults?.length} | Total Meters: {fullResults?.reduce((a, c) => a + c.total_distance, 0)} m | Max HR: {maxHR}</p>
                </>}
				<ActiveFiltersBar filterMap={filterMap} sortFunction={sortFunction} applyFilters={applyFilters} />
            <button onClick={() => setIsGraphOpen(true)}>Open Graph</button>
            <MovablePopup isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} >
                <p>This is a movable popup window!</p>
                <p>You can drag the header to move it around.</p>
            </MovablePopup>
        </div>
    );
}

export default ResultTableTopMenu;