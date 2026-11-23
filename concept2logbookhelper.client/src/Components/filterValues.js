export function dateKey(date) {
    if (!Number.isFinite(date.getTime())) return undefined;
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseDuration(input, allowHours = false) {
    const match = /^(?:(\d+):)?(\d+):([0-5]\d)(?:\.(\d+))?$/.exec(input);
    if (!match) return undefined;

    const [, hours, minutes, seconds, fraction = '0'] = match;
    if (hours !== undefined && (!allowHours || minutes.length !== 2 || Number(minutes) >= 60)) return undefined;

    const deciseconds = Number(hours ?? 0) * 36000 + Number(minutes) * 600
        + Number(seconds) * 10 + Number(`0.${fraction}`) * 10;
    return Number.isFinite(deciseconds) && deciseconds <= Number.MAX_SAFE_INTEGER ? deciseconds : undefined;
}
