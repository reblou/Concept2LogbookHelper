import { useContext, useState } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';

function FilterButtonList({ filterOptionList = [] }) {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState([]);
    const applyFilter = useContext(FilterCallbackContext);
    const search = query.trim().toLowerCase();
    const matchesSearch = value => value?.toLowerCase().includes(search);
    const visibleOptions = filterOptionList.filter(matchesSearch);

    function toggle(option) {
        setSelected(current => current.includes(option)
            ? current.filter(value => value !== option)
            : [...current, option]);
    }

    function submit(event) {
        event.preventDefault();
        if (selected.length) {
            applyFilter(value => selected.includes(value), `Type · ${selected.join(', ')}`);
        } else if (search) {
            applyFilter(matchesSearch, `Type contains “${query.trim()}”`);
        }
    }

    return (
        <form className="filter-form" onSubmit={submit}>
            <h2>Filter by workout type</h2>
            <label className="filter-field">
                <span>Search types</span>
                <input type="search" value={query} onChange={event => setQuery(event.target.value)} />
            </label>
            <fieldset className="filter-type-options">
                <legend>Select workout types</legend>
                <div className="filter-type-list">
                    {visibleOptions.map(option => (
                        <label key={option}>
                            <input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} />
                            <span>{option}</span>
                        </label>
                    ))}
                    {!visibleOptions.length && <p className="filter-note">No matching workout types.</p>}
                </div>
            </fieldset>
            {selected.length > 0 && (
                <div className="filter-selection">
                    <span aria-live="polite">{selected.length} selected</span>
                    <button type="button" className="secondary-button" onClick={() => setSelected([])}>Clear selection</button>
                </div>
            )}
            <button type="submit" disabled={!selected.length && !search}>
                {search && !selected.length ? 'Apply text match' : 'Apply filter'}
            </button>
        </form>
    );
}

export default FilterButtonList;
