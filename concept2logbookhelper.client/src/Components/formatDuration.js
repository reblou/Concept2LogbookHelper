export function formatDuration(deciseconds, precision = 0) {
    const scale = 10 ** precision;
    const totalSeconds = Math.round(deciseconds / 10 * scale) / scale;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = (totalSeconds % 60).toFixed(precision).padStart(precision ? 4 : 2, '0');
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
}
