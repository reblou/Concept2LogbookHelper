import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDuration } from './formatDuration.js';
import '../css/HeartRateZones.css';

const api = '/api/logbook/heart-rate';
const thresholds = [50, 60, 70, 80, 90];
const empty = [];
const maxConcurrent = 4;

function getStrokeWorkouts(results) {
    return results.filter(workout => {
        const intervals = workout.workout?.intervals;
        const intervalWorkout = /Interval|MultiErg/i.test(workout.workout_type);
        return workout.stroke_data !== false && workout.time > 0 &&
            (!intervalWorkout || intervals?.length > 0) &&
            (!intervals || intervals.every(interval => interval.time > 0));
    });
}

async function fetchTotals(workout, maxHeartRate) {
    try {
        const response = await fetch(`${api}-zones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                workoutId: workout.id,
                maxHeartRate,
                workTime: workout.time,
                intervalWorkTimes: workout.workout?.intervals?.map(interval => interval.time) ?? [],
            }),
        });
        if (response.status === 204) return {};
        if (response.status === 429) {
            const wait = Number(response.headers.get('Retry-After')) || 30;
            return { failed: true, retryAt: Date.now() + wait * 1000 };
        }
        if (response.status === 409) return { failed: true, refreshProfile: true };
        if (!response.ok) return { failed: true };
        return { totals: await response.json() };
    } catch {
        return { failed: true };
    }
}

function HeartRateZones({ id, open, results = empty }) {
    const [profile, setProfile] = useState(null);
    const [profileAttempt, setProfileAttempt] = useState(0);
    const [retryAttempt, setRetryAttempt] = useState(0);
    const [, update] = useState(0);
    const completed = useRef(new Map());
    const inFlight = useRef(new Map());
    const retryAt = useRef(0);
    const workouts = useMemo(() => getStrokeWorkouts(results), [results]);
    const maxHeartRate = profile?.maxHeartRate;

    useEffect(() => {
        if (!open) {
            setProfile(null);
            return;
        }
        const controller = new AbortController();

        async function loadProfile() {
            try {
                const response = await fetch(`${api}-profile`, { signal: controller.signal });
                if (response.status === 429) {
                    const wait = Number(response.headers.get('Retry-After')) || 30;
                    if (!controller.signal.aborted) setProfile({ failed: true, retryAt: Date.now() + wait * 1000 });
                    return;
                }
                const json = response.headers.get('Content-Type')?.includes('application/json');
                if (!response.ok || !json) {
                    if (!controller.signal.aborted) setProfile({ failed: true, status: response.status, json });
                    return;
                }
                const value = await response.json();
                if (!controller.signal.aborted) setProfile(value);
            } catch {
                if (!controller.signal.aborted) setProfile({ failed: true });
            }
        }

        loadProfile();
        return () => controller.abort();
    }, [open, profileAttempt]);

    useEffect(() => {
        if (!open || !maxHeartRate) return;
        let active = true;
        let next = 0;
        const keyFor = workout => `${maxHeartRate}:${workout.id}`;

        async function runQueue() {
            while (active) {
                while (retryAt.current === 0 && next < workouts.length && inFlight.current.size < maxConcurrent) {
                    const workout = workouts[next++];
                    const key = keyFor(workout);
                    if (completed.current.has(key) || inFlight.current.has(key)) continue;

                    const request = fetchTotals(workout, maxHeartRate).then(result => {
                        completed.current.set(key, result);
                        inFlight.current.delete(key);
                        if (result.retryAt) retryAt.current = Math.max(retryAt.current, result.retryAt);
                    });
                    inFlight.current.set(key, request);
                }
                if (inFlight.current.size === 0) break;
                await Promise.race(inFlight.current.values());
                if (active) update(version => version + 1);
            }
        }

        runQueue();
        return () => { active = false; };
    }, [open, maxHeartRate, workouts, retryAttempt]);

    function refreshProfile() {
        for (const [key, result] of completed.current) {
            if (result.refreshProfile) completed.current.delete(key);
        }
        setProfile(null);
        setProfileAttempt(attempt => attempt + 1);
    }

    function retry() {
        if (Date.now() < retryAt.current) return;
        retryAt.current = 0;
        for (const workout of workouts) {
            const key = `${maxHeartRate}:${workout.id}`;
            if (completed.current.get(key)?.failed) completed.current.delete(key);
        }
        setRetryAttempt(attempt => attempt + 1);
    }

    const cooldown = retryAt.current;
    const profileCooldown = profile?.retryAt ?? 0;
    const nextRetry = Math.max(cooldown, profileCooldown);
    useEffect(() => {
        if (!open || nextRetry <= Date.now()) return;
        const timer = setTimeout(() => update(version => version + 1), nextRetry - Date.now());
        return () => clearTimeout(timer);
    }, [open, nextRetry]);

    const analysed = workouts.map(workout => completed.current.get(`${maxHeartRate}:${workout.id}`)).filter(Boolean);
    const zones = thresholds.map(() => 0);
    let belowZone = 0;
    let contributors = 0;
    let failures = 0;
    let needsProfile = false;
    for (const record of analysed) {
        if (record.failed) failures++;
        if (record.refreshProfile) needsProfile = true;
        if (!record.totals) continue;
        contributors++;
        belowZone += record.totals.belowZone;
        record.totals.zones.forEach((duration, index) => { zones[index] += duration; });
    }
    const zoneTime = zones.reduce((sum, duration) => sum + duration, 0);
    const workTime = results.reduce((sum, workout) => sum + Math.max(0, workout.time || 0), 0);
    const incomplete = analysed.length < workouts.length;
    const loading = incomplete && !cooldown;

    return (
        <section id={id} hidden={!open} className="hr-zones" aria-labelledby={`${id}-heading`}>
            <h2 id={`${id}-heading`}>Time in HR zones</h2>
            {open && <>
                {!profile && <p role="status">Loading your Concept2 profile…</p>}
                {profile?.failed && <p role="status">
                    {profile.status === 401 ? 'Your logbook session expired. Sign in again to load your Concept2 profile.' :
                        profile.status === 403 ? 'Concept2 denied profile access. Sign out and reconnect your Concept2 account.' :
                        profile.retryAt ? 'Concept2 temporarily limited profile requests. Try again shortly.' :
                        profile.status === 404 || (profile.status === 200 && !profile.json) ?
                            'The logbook server is missing the heart-rate profile endpoint. Restart it with the current build.' :
                            'Could not load your Concept2 profile.'}
                </p>}
                {profile && !profile.failed && !maxHeartRate && (
                    <p role="status">Set your maximum heart rate in Concept2 Logbook to see time in zones.</p>
                )}
                {profile && (!maxHeartRate || needsProfile) && (
                    <button className="secondary-button" onClick={refreshProfile} disabled={nextRetry > Date.now()}>Refresh Concept2 profile</button>
                )}
                {maxHeartRate > 0 && <>
                    <p>Profile max HR {maxHeartRate} bpm · Estimated time during work intervals</p>
                    {results.length === 0 ? <p role="status">No matching workouts.</p> : <>
                        <div role="status">
                            {loading && <p>Analysing {analysed.length} of {workouts.length} workouts… Large selections can take a while.</p>}
                            {cooldown > 0 && <p>Concept2 limited requests. Analysis is paused.</p>}
                            {failures > 0 && <p>Analysis is incomplete. Could not analyse {failures} {failures === 1 ? 'workout' : 'workouts'}.</p>}
                            {!incomplete && !failures && !contributors && <p>No usable heart-rate samples in these workouts.</p>}
                        </div>
                        {(failures > 0 || cooldown > 0) && !needsProfile && (
                            <button className="secondary-button" onClick={retry} disabled={cooldown > Date.now()}>Retry analysis</button>
                        )}
                        {(contributors > 0 || (!incomplete && !failures)) && <>
                            <p>HR recorded for {formatDuration(zoneTime + belowZone, 1)} of {formatDuration(workTime, 1)} work time · {contributors} of {results.length} workouts</p>
                            {contributors > 0 && <>
                                <ol className="hr-zone-list">
                                    {zones.map((duration, index) => {
                                        const lower = Math.ceil(maxHeartRate * thresholds[index] / 100);
                                        const upper = Math.ceil(maxHeartRate * thresholds[index + 1] / 100) - 1;
                                        const range = index === 4 ? `${lower}+` : lower <= upper ? `${lower}–${upper}` : '—';
                                        const percent = zoneTime ? duration / zoneTime * 100 : 0;
                                        return (
                                            <li key={thresholds[index]} className={`hr-zone-row zone-${index + 1}`}>
                                                <strong>Z{index + 1}</strong>
                                                <span>{range} bpm</span>
                                                <div className="hr-zone-track" aria-hidden="true"><div style={{ width: `${percent}%` }} /></div>
                                                <span>{formatDuration(duration, 1)}</span>
                                                <span>{percent.toFixed(1)}%</span>
                                            </li>
                                        );
                                    })}
                                </ol>
                                <p>Below Z1 · {formatDuration(belowZone, 1)}. Percentages use time recorded in Z1–Z5.</p>
                            </>}
                        </>}
                    </>}
                </>}
            </>}
        </section>
    );
}

export default HeartRateZones;
