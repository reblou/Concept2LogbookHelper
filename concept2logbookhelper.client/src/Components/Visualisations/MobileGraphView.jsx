import { useLocation } from 'react-router-dom'
import ResultGraph from './ResultGraph.jsx'

function MobileGraphView() {
	const { state } = useLocation()
	const { results } = state

	const display = (
			results == undefined ? <p>No Results to display</p> :
				<ResultGraph resultsInView={results} />
	)

	return (
		<div style={{width:"200%", height:600, overflow:"scroll", display: "block", flexShrink:0, flexFlow: "Flex-start"}}>
			{display}
		</div>
  );
}

export default MobileGraphView;