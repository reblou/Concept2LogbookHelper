import "../css/ActiveFiltersBar.css";

function ActiveFilter({ label, closeCallback }) {
  return (
      <div className="Filter">
          <span>{label}</span>
          <button className="x" onClick={closeCallback} aria-label={`Remove ${label}`}>×</button>
      </div>
  );
}

export default ActiveFilter;
