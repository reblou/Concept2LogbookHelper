import { useContext, useId, useRef } from 'react';
import '../css/ResultTableHeader.css';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';
import { SortCallbackContext } from '../Contexts/SortCallbackContext.js';

function ResultTableHeader({ label, filterMenuContentsComponent, ResultPropSelector, filterValue = ResultPropSelector }) {
    const menuId = useId();
    const menuRef = useRef(null);
    const filterResults = useContext(FilterCallbackContext);
    const sortResults = useContext(SortCallbackContext);

    function positionMenu(event) {
        const bounds = event.currentTarget.getBoundingClientRect();
        const width = Math.min(340, document.documentElement.clientWidth - 24);
        const left = Math.max(12, Math.min(bounds.left, document.documentElement.clientWidth - width - 12));
        const spaceBelow = window.innerHeight - bounds.bottom;
        const openAbove = spaceBelow < Math.min(410, bounds.top);
        const menu = menuRef.current;
        menu.style.width = `${width}px`;
        menu.style.left = `${left}px`;
        menu.style.top = openAbove ? 'auto' : `${bounds.bottom + 6}px`;
        menu.style.bottom = openAbove ? `${window.innerHeight - bounds.top + 6}px` : 'auto';
        menu.style.maxHeight = `${Math.max(0, Math.min(410, (openAbove ? bounds.top : spaceBelow) - 18))}px`;
    }

    function applyFilter(condition, description, dateRange) {
        menuRef.current.hidePopover();
        filterResults(filterValue, condition, label, description, dateRange);
    }

    return (
        <th scope="col">
            <div className="FilterHeaderItems">
                <span>{label}</span>
                {filterMenuContentsComponent && (
                    <button className="FilterMenuButton" aria-label={`Filter by ${label}`}
                        popovertarget={menuId} onClick={positionMenu}>
                        <span className="filter-icon" aria-hidden="true" />
                    </button>
                )}
                <button className="FilterMenuButton" aria-label={`Sort by ${label}`}
                    onClick={() => sortResults(ResultPropSelector, label)}>
                    <span className="sort-icon" aria-hidden="true" />
                </button>
            </div>
            {filterMenuContentsComponent && (
                <div className="FilterListMenu" id={menuId} ref={menuRef} popover="auto" aria-label={`Filter by ${label}`}>
                    <FilterCallbackContext.Provider value={applyFilter}>
                        {filterMenuContentsComponent}
                    </FilterCallbackContext.Provider>
                </div>
            )}
        </th>
    );
}

export default ResultTableHeader;
