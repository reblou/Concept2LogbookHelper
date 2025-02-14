import "../css/ActiveFiltersBar.css";
import ActiveFilter from "./ActiveFilter";

function ActiveFiltersBar({ filterMap, sortFunction, applyFilters }) {
	return (
			filterMap.size > 0 || typeof sortFunction.current !== "undefined" ?

			<div className="ActiveFilters">
				{Array.from(filterMap).map(([key, value]) =>
					<ActiveFilter key={key} label={value.desc} />
				)}
				{typeof sortFunction.current !== "undefined" ? <ActiveFilter key={sortFunction.current.label} label={sortFunction.current.label + (sortFunction.current.toggle ? " asc" : " desc" )} /> : <></>}
				
				<button className="ClearButton" onClick={() => {
					filterMap.clear();
					sortFunction.current = undefined;
					applyFilters();
				}}>Clear All Filters</button> 
		</div>:
				<></>

  );

}

export default ActiveFiltersBar;