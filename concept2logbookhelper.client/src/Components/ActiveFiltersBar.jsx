import "../css/ActiveFiltersBar.css";

function ActiveFiltersBar({ filterMap, sortFunction, applyFilters }) {
  return (
    <div className="ActiveFilters">
		<p>E.g. 8x500m -&gt; </p>
		<button onClick={() => { filterMap.current.clear(); sortFunction.current = undefined; applyFilters(); }}>Clear All Filters</button>
	</div>
  );

}

export default ActiveFiltersBar;