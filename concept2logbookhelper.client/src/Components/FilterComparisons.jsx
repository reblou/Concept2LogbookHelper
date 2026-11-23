import { useContext, useId, useState } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';
import { dateKey, parseDuration } from './filterValues';

const comparisons = {
    number: ['Exactly', 'At least', 'At most'],
    date: ['On', 'On or after', 'On or before'],
    time: ['Exactly', 'At least', 'At most'],
    pace: ['Exactly', 'Slower than or equal to', 'Faster than or equal to'],
};

function FilterComparisons({ label, kind = 'number', unit, placeholder }) {
    const [comparison, setComparison] = useState('0');
    const [minimum, setMinimum] = useState('');
    const [maximum, setMaximum] = useState('');
    const [error, setError] = useState(null);
    const applyFilter = useContext(FilterCallbackContext);
    const inputId = useId();
    const isDate = kind === 'date';
    const isDuration = kind === 'time' || kind === 'pace';
    const isRange = comparison === '3';
    const firstLabel = isRange ? (isDate ? 'Start date' : 'Minimum') : label;
    const secondLabel = isDate ? 'End date' : 'Maximum';

    function parse(value) {
        const input = value.trim();
        if (isDate) return input || undefined;
        if (isDuration) return parseDuration(input, kind === 'time');
        const meters = unit === 'm' ? input.replace(/\s*m$/i, '') : input;
        const groupedDistance = unit === 'm' && /^\d{1,3}(?:,\d{3})+$|^\d{1,3}(?:\.\d{3})+$/.test(meters);
        if (!/^\d+$/.test(meters) && !groupedDistance) return undefined;
        const amount = Number(meters.replace(/[,.]/g, ''));
        return Number.isSafeInteger(amount) ? amount : undefined;
    }

    function format(value, rawValue) {
        if (isDate) return value;
        const display = isDuration ? rawValue.trim() : value.toLocaleString();
        return unit ? `${display} ${unit}` : display;
    }

    function submit(event) {
        event.preventDefault();
        const lower = parse(minimum);
        const upper = isRange ? parse(maximum) : undefined;
        const message = isDuration
            ? `Enter ${label.toLowerCase()} like ${placeholder}.`
            : isDate ? 'Choose a date.' : 'Enter a non-negative whole number.';

        if (lower === undefined) return setError({ field: 'minimum', message });
        if (isRange && upper === undefined) return setError({ field: 'maximum', message });
        if (isRange && lower > upper) {
            return setError({ field: 'maximum', message: isDate ? 'End date must be on or after start date.' : 'Maximum must be at least the minimum.' });
        }

        const first = format(lower, minimum);
        const [condition, description] = {
            '0': [value => value === lower, `${comparisons[kind][0]} ${first}`],
            '1': [value => value >= lower, `${comparisons[kind][1]} ${first}`],
            '2': [value => value <= lower, `${comparisons[kind][2]} ${first}`],
            '3': [value => value >= lower && value <= upper, isRange ? `Between ${first} and ${format(upper, maximum)}` : ''],
        }[comparison];
        const dateRange = isDate && isRange ? { from: lower, to: upper } : undefined;
        applyFilter(value => value != null && condition(value), `${label} · ${description}`, dateRange);
    }

    function applyDateShortcut(shortcut, startOfYear) {
        const today = new Date();
        const start = new Date(today);
        if (startOfYear) start.setMonth(0, 1);
        else start.setDate(start.getDate() - 29);
        const from = dateKey(start);
        const to = dateKey(today);
        applyFilter(value => value >= from && value <= to, `Date · ${shortcut}`, { from, to });
    }

    function renderInput(field, fieldLabel, value, setValue) {
        const invalid = error?.field === field;
        const id = `${inputId}-${field}`;
        const description = [unit && `${id}-unit`, invalid && `${id}-error`].filter(Boolean).join(' ');
        return (
            <div className="filter-field">
                <label htmlFor={id}>{fieldLabel}</label>
                <span className="filter-value">
                    <input id={id} type={isDate ? 'date' : 'text'}
                        inputMode={kind === 'number' ? 'numeric' : undefined}
                        placeholder={placeholder} value={value}
                        aria-invalid={invalid || undefined}
                        aria-describedby={description || undefined}
                        onChange={event => { setValue(event.target.value); setError(null); }} />
                    {unit && <span className="filter-unit" id={`${id}-unit`}>{unit}</span>}
                </span>
                {invalid && <span className="filter-error" id={`${id}-error`} role="alert">{error.message}</span>}
            </div>
        );
    }

    return (
        <form className="filter-form" onSubmit={submit} noValidate>
            <h2>Filter by {label}</h2>
            {isDate && (
                <div className="filter-shortcuts">
                    <button type="button" className="secondary-button" onClick={() => applyDateShortcut('Last 30 days', false)}>Last 30 days</button>
                    <button type="button" className="secondary-button" onClick={() => applyDateShortcut('This year', true)}>This year</button>
                </div>
            )}
            <label className="filter-field">
                <span>Comparison</span>
                <select value={comparison} onChange={event => { setComparison(event.target.value); setError(null); }}>
                    {[...comparisons[kind], 'Between'].map((option, index) => (
                        <option key={option} value={index}>{option}</option>
                    ))}
                </select>
            </label>
            {renderInput('minimum', firstLabel, minimum, setMinimum)}
            {isRange && renderInput('maximum', secondLabel, maximum, setMaximum)}
            <button type="submit">Apply filter</button>
        </form>
    );
}

export default FilterComparisons;
