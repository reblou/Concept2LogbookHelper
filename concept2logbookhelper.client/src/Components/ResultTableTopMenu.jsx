import Loading from "./Loading.jsx";
import MobileWarning from "./MobileWarning";

function ResultTableTopMenu({ fullResults, loading, filterMap, sortFunction, applyFilters }) {
    const maxHR = Math.max(
        fullResults?.map(result => result.heart_rate?.max ?? 0)
            ?.reduce((a, b) => Math.max(a, b), 0)) || 0;

    return (
        <div className='results-table-topmenu'>

            <MobileWarning />    
            {!loading ?       
                <Loading/> : <>     
                    <p> Total Workouts: {fullResults?.length} | Total Meters: {fullResults?.reduce((a, c) => a + c.total_distance, 0)} m | Max HR: {maxHR}</p>
                </>}
                <button onClick={() => { filterMap.current.clear(); sortFunction.current = undefined; applyFilters(); }}>Clear All Filters</button>

        </div>
  );
}

export default ResultTableTopMenu;