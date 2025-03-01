import "../css/ActiveFiltersBar.css";
import ActiveFilter from "./ActiveFilter";

function ActiveFiltersBar({ filterMap, sortFunction, applyFilters }) {
	return (
			filterMap.size > 0 || typeof sortFunction.current !== "undefined" ?

			<div className="ActiveFilters">
				<p>Active Filters: </p>
				{Array.from(filterMap).map(([key, value]) =>
					<ActiveFilter key={key} label={value.desc} closeCallback={() => close(key, false)} />
				)}
				{typeof sortFunction.current !== "undefined" ? <ActiveFilter key={sortFunction.current.label} label={sortFunction.current.label + (sortFunction.current.toggle ? " asc" : " desc" )} closeCallback={label => close(null, true)}/> : <></>}
				
				<button className="ClearButton" onClick={() => {
					filterMap.clear();
					sortFunction.current = undefined;
					applyFilters();
				}}>Clear All Filters</button> 
		</div>:
				<></>

  );

	function close(label, sort) {
		//remove from filter map or clear sort function
		console.log("Closing " + label);

		if (sort) {
			sortFunction.current = undefined;
		} else {
			filterMap.delete(label);
		}

		applyFilters();
		return;
	}
}

export default ActiveFiltersBar;