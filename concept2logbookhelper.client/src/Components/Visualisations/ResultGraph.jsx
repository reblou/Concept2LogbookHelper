import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import "../../css/ResultGraph.css";
import { useState, useEffect } from 'react';
import moment from 'moment';

function formatPace(averagePace) {
    const minutes = Math.floor(averagePace / 60);
    const seconds = Math.floor(averagePace % 60);
    const tenths = Math.floor((averagePace % 1) * 10);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}.${tenths}`;
}

function ResultGraph({ resultsInView }) {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let result = payload[0].payload;

            return (
                <div className="custom-tooltip">
                    <p className="label">{`${moment(result.date).format('YYYY-MM-DD HH:mm')} - ${result.pretty_workout_type}`}</p>
                    <p className="pace">{`Pace: ${result.pretty_average_pace}`}</p>
                    <p className="time">{`Time: ${result.time_formatted}`}</p>
                    <p className="distance">{`Distance: ${result.total_distance}m`}</p>
                </div>
            );
        }

        return null;
    };

    const renderLineChart = (
			<ResponsiveContainer width="100%" height="100%">
				<LineChart className="ResultLineGraph" data={resultsInView} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
					<Line type="monotone" dataKey="average_pace" stroke="#8884d8" />
					<CartesianGrid stroke="#ccc" />
					<XAxis dataKey="date" reversed={true} tickFormatter={d => moment(d).format('YYYY-MM-DD')} angle={-45} tickCount={50} textAnchor={'end'} />
					<YAxis tickFormatter={formatPace} scale={"auto"} allowDataOverflow={true} domain={['dataMin-5', 'dataMax+5']} interval={0}  tickCount={10} />
					<Tooltip content={<CustomTooltip />} />
				</LineChart>
            </ResponsiveContainer>
    );

    return renderLineChart;
}

export default ResultGraph;