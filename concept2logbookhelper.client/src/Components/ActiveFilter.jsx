import "../css/ActiveFiltersBar.css";

function ActiveFilter({ label, closeCallback }) {
  return (
      <div className="Filter">
          <p>{label} <span className="x" onClick={closeCallback}>X</span></p>
      </div>
  );
}

export default ActiveFilter;