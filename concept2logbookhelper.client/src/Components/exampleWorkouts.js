function formatTime(seconds, showTenths = false) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    const formattedSeconds = showTenths ? remainder.toFixed(1).padStart(4, '0') : String(remainder).padStart(2, '0');
    return `${minutes}:${formattedSeconds}`;
}

export const exampleWorkouts = [
    { day: 18, distance: 6000, seconds: 1560, strokeRate: 23, calories: 315, averageHR: 146, maxHR: 158, justRow: true },
    { day: 17, distance: 2500, seconds: 625, strokeRate: 29, calories: 153, averageHR: 163, maxHR: 179 },
    { day: 14, distance: 5000, seconds: 1270, strokeRate: 26, calories: 287, averageHR: 155, maxHR: 172 },
    { day: 12, distance: 2000, seconds: 480, strokeRate: 31, calories: 127, averageHR: 171, maxHR: 185 },
    { day: 10, distance: 2500, seconds: 635, strokeRate: 28, calories: 150, averageHR: 162, maxHR: 176 },
    { day: 8, distance: 4000, seconds: 1080, strokeRate: 21, calories: 208, averageHR: 138, maxHR: 151, justRow: true },
    { day: 6, distance: 5000, seconds: 1295, strokeRate: 25, calories: 280, averageHR: 154, maxHR: 169 },
    { day: 3, distance: 2500, seconds: 650, strokeRate: 27, calories: 145, averageHR: 160, maxHR: 174 },
].map(({ day, distance, seconds, strokeRate, calories, averageHR, maxHR, justRow }) => {
    const pace = seconds * 500 / distance;

    return {
        id: day,
        date: new Date(2026, 10, day, 18),
        distance,
        total_distance: distance,
        total_time: seconds * 10,
        type: 'rower',
        time_formatted: formatTime(seconds),
        average_pace: pace,
        pretty_average_pace: formatTime(pace, true),
        workout_type: justRow ? 'JustRow' : 'FixedDistanceSplits',
        pretty_workout_type: justRow ? 'JustRow' : `${distance}m`,
        stroke_rate: strokeRate,
        calories_total: calories,
        heart_rate: { average: averageHR, max: maxHR },
    };
});
