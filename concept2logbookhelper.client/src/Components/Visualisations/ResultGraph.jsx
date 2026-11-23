import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import "../../css/ResultGraph.css";
import moment from 'moment';

function formatPace(averagePace) {
    const minutes = Math.floor(averagePace / 60);
    const seconds = Math.floor(averagePace % 60);
    const tenths = Math.floor((averagePace % 1) * 10);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}.${tenths}`;
}

function ResultGraph({ resultsInView, compact = false }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            let result = payload[0].payload;

            return (
                <div className="custom-tooltip">
                    <p className="label">{`${moment(result.date).format(compact ? 'D MMM' : 'YYYY-MM-DD HH:mm')} - ${result.pretty_workout_type}`}</p>
                    <p className="pace">{`Pace: ${result.pretty_average_pace}`}</p>
                    <p className="time">{`Time: ${result.time_formatted}`}</p>
                    <p className="distance">{`Distance: ${result.total_distance}m`}</p>
                </div>
            );
        }

        return null;
    };

    const renderLineChart = (
        <ResponsiveContainer className="ResultContainer" width="100%" height="100%" >
			<LineChart className="ResultLineGraph" data={resultsInView}>
				<Line className="ResultLine" type="monotone" dataKey="average_pace" stroke="var(--accent)" strokeWidth={2} />
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis className="ResultAxis" dataKey="date" reversed={true} tickFormatter={d => moment(d).format(compact ? 'D MMM' : 'YYYY-MM-DD')} angle={compact ? 0 : -45} tickCount={50} textAnchor={compact ? 'middle' : 'end'} height={compact ? 30 : 75} stroke="var(--muted)" padding={compact ? { left: 22, right: 22 } : undefined} />
                <YAxis className="ResultAxis" tickFormatter={formatPace} scale={"auto"} allowDataOverflow={true} domain={['dataMin-5', 'dataMax+5']} interval={0} tickCount={compact ? 4 : 10} stroke="var(--muted)" />
				<Tooltip content={<CustomTooltip />} />
			</LineChart>
        </ResponsiveContainer>
    );

    return renderLineChart;
}

export default ResultGraph;
