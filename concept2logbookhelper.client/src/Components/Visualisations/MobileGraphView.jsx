import { Link, useLocation } from 'react-router-dom';
import ResultGraph from './ResultGraph.jsx';

function MobileGraphView() {
    const { state } = useLocation();
    const results = state?.results;

    return (
        <main>
            <Link to="/logbook">Back to Logbook</Link>
            <h1 className="logTitle">Results</h1>
            <div className="graph-panel">
                {results?.length ? (
                    <div className="graph-canvas"><ResultGraph resultsInView={results} /></div>
                ) : <p>No results to display.</p>}
            </div>
        </main>
    );
}

export default MobileGraphView;
