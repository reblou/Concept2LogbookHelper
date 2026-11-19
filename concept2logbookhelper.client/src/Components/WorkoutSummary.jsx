function formatDuration(deciseconds, precision = 0) {
    const scale = 10 ** precision;
    const totalSeconds = Math.round(deciseconds / 10 * scale) / scale;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = (totalSeconds % 60).toFixed(precision).padStart(precision ? 4 : 2, '0');
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
}

const dayMs = 86_400_000;
const wholeNumber = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const decimalNumber = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

function Duration({ deciseconds }) {
    const time = formatDuration(deciseconds);
    return <>{time} <small>{time.split(':').length === 3 ? 'h:mm:ss' : 'm:ss'}</small></>;
}

function HoursAndMinutes({ deciseconds }) {
    const totalMinutes = Math.round(deciseconds / 600);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return (
        <>
            {hours > 0 && <>{wholeNumber.format(hours)}<small>h</small>{' '}</>}
            {minutes}<small>m</small>
        </>
    );
}

function WorkoutSummary({ results, totalCount, filtered, dateRange }) {
    const count = results.length;
    const countLabel = wholeNumber.format(count);
    const first = results[0];
    let distance = 0;
    let time = 0;
    let averageHrSum = 0;
    let averageHrCount = 0;
    let maxHr = 0;
    let bestPace = Infinity;
    let comparable = count > 1 && Boolean(first?.type) && first.workout_type === 'FixedDistanceSplits';

    for (const result of results) {
        distance += result.total_distance;
        time += result.total_time;

        const { average, max } = result.heart_rate ?? {};
        if (Number.isFinite(average) && average > 0) {
            averageHrSum += average;
            averageHrCount += 1;
        }
        if (Number.isFinite(max) && max > 0) maxHr = Math.max(maxHr, max);

        comparable = comparable && result.type === first.type && result.distance === first.distance
            && result.workout_type === first.workout_type;
        if (Number.isFinite(result.average_pace) && result.average_pace > 0) {
            bestPace = Math.min(bestPace, result.average_pace);
        }
    }

    const days = dateRange ? (Date.parse(dateRange.to) - Date.parse(dateRange.from)) / dayMs + 1 : 0;
    const weeks = days / 7;

    return (
        <div className="workout-summary" aria-label="Workout statistics" role="region">
            <section className="summary-group">
                <h2>Training volume</h2>
                <dl>
                    <div>
                        <dt>Workouts</dt>
                        <dd>{countLabel}{filtered && <small> of {wholeNumber.format(totalCount)}</small>}</dd>
                    </div>
                    <div><dt>Total distance</dt><dd>{wholeNumber.format(distance)} <small>m</small></dd></div>
                    <div>
                        <dt>Total time</dt>
                        <dd className="summary-compact-time"><HoursAndMinutes deciseconds={time} /></dd>
                    </div>
                    {weeks >= 1 && (
                        <>
                            <div><dt>Workouts / week</dt><dd>{decimalNumber.format(count / weeks)}</dd></div>
                            <div><dt>Distance / week</dt><dd>{wholeNumber.format(distance / weeks)} <small>m</small></dd></div>
                            <div><dt>Time / week</dt><dd className="summary-compact-time"><HoursAndMinutes deciseconds={time / weeks} /></dd></div>
                        </>
                    )}
                </dl>
            </section>
            <section className="summary-group">
                <h2>Typical workout</h2>
                <dl>
                    <div><dt>Avg distance</dt><dd>{count ? <>{wholeNumber.format(distance / count)} <small>m</small></> : '—'}</dd></div>
                    <div><dt>Avg duration</dt><dd>{count ? <Duration deciseconds={time / count} /> : '—'}</dd></div>
                    {comparable && Number.isFinite(bestPace) && (
                        <div><dt>Best pace</dt><dd>{formatDuration(bestPace * 10, 1)} <small>/ 500 m</small></dd></div>
                    )}
                </dl>
            </section>
            <section className="summary-group summary-heart-rate">
                <h2>Heart rate</h2>
                <dl>
                    <div><dt>Avg workout HR</dt><dd>{averageHrCount ? <>{wholeNumber.format(averageHrSum / averageHrCount)} <small>bpm</small></> : '—'}</dd></div>
                    <div><dt>Highest HR</dt><dd>{maxHr ? <>{wholeNumber.format(maxHr)} <small>bpm</small></> : '—'}</dd></div>
                </dl>
                <p>{wholeNumber.format(averageHrCount)} of {countLabel} workouts with average HR</p>
            </section>
        </div>
    );
}

export default WorkoutSummary;
