import { Link, useLocation } from 'react-router-dom';
import ResultGraph from './ResultGraph.jsx';
import { exampleWorkouts } from '../exampleWorkouts.js';

function MobileGraphView({ example = false }) {
    const { state } = useLocation();
    const results = state?.results ?? (example ? exampleWorkouts : undefined);

    return (
        <main>
            <Link to={example ? "/example" : "/logbook"}>{example ? 'Back to example logbook' : 'Back to Logbook'}</Link>
            <h1 className="logTitle">{example ? 'Example results' : 'Results'}</h1>
            <div className="graph-panel">
                {results?.length ? (
                    <div className="graph-canvas"><ResultGraph resultsInView={results} /></div>
                ) : <p>No results to display.</p>}
            </div>
        </main>
    );
}

export default MobileGraphView;
