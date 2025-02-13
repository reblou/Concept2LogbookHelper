import "../css/ActiveFiltersBar.css";

function ActiveFilter({ label }) {
  return (
      <div className="Filter">
          <p>{label}</p>
      </div>
  );
}

export default ActiveFilter;