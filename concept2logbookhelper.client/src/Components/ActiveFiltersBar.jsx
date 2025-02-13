import "../css/ActiveFiltersBar.css";
import ActiveFilter from "./ActiveFilter";

function ActiveFiltersBar({ filterMap, sortFunction, applyFilters }) {
	return (
			filterMap.current.size > 0 || typeof sortFunction.current !== "undefined" ?

			<div className="ActiveFilters">
				{Array.from(filterMap.current).map(([key, value]) =>
					<ActiveFilter key={key} label={value.desc} />
				)}
				
				<button onClick={() => { filterMap.current.clear(); sortFunction.current = undefined; applyFilters(); }}>Clear All Filters</button> 
		</div>:
				<></>

  );

}

export default ActiveFiltersBar;