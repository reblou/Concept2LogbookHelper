

function ResultTableTotals({ fullResults, loading }) {
    const maxHR = Math.max(
        fullResults?.map(result => result.heart_rate?.max ?? 0)
            ?.reduce((a, b) => Math.max(a, b), 0)) || 0;

    return (
        <div>
            {loading ?
                <p>Populating Results Table...</p> : 
                <p> Total Workouts: {fullResults?.length} | Total Meters: {fullResults?.reduce((a, c) => a + c.total_distance, 0)} m | Max HR: {maxHR}</p>}
        </div>
  );
}

export default ResultTableTotals;