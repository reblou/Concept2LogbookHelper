import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import "../../css/ResultGraph.css";
import { useState, useEffect } from 'react';

function formatPace(averagePace) {
    const minutes = Math.floor(averagePace / 60);
    const seconds = Math.floor(averagePace % 60);
    const tenths = Math.floor((averagePace % 1) * 10);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}.${tenths}`;
}

function ResultGraph({ resultsInView }) {
	const [paceMin, setPaceMin] = useState(0);
	const [paceMax, setPaceMax] = useState(180);
    const bufferSecs = 5;

    useEffect(() => {
        setPaceMin(resultsInView.reduce((min, result) => { return result.average_pace < min ? result.average_pace : min }, 500));
        setPaceMax(resultsInView.reduce((max, result) => { return result.average_pace > max ? result.average_pace : max }, 0));
    }, [resultsInView]);

    const renderLineChart = (
        <div className="lineChartContainer">
            <LineChart width={600} height={300} data={resultsInView}>
				<Line type="monotone" dataKey="average_pace" stroke="#8884d8" />
				<CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date_utc" reversed={true} />
                <YAxis tickFormatter={formatPace} scale={"auto"} allowDataOverflow={true} domain={[paceMin-bufferSecs, paceMax+bufferSecs]} />
			</LineChart>
		</div>

    );

    return renderLineChart;
}

export default ResultGraph;