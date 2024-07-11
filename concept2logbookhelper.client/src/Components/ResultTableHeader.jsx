import { useState, useRef, React, useContext } from 'react';
import './ResultTableHeader.css';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';

function ResultTableHeader({label, filterMenuContentsComponent, ResultPropSelector }) {
    const [popup, setPopup] = useState(false);
    const filterResultsCallback = useContext(FilterCallbackContext);

    return (
        <th>{label}<button className='FilterMenuButton' onClick={() => setPopup(!popup)} />
            <FilterCallbackContext.Provider value={FilterItemClick}>
            {popup &&
                <div>
                    <div className='PopupDisabler' onClick={() => setPopup(!popup)} />
                    <div className='FilterListMenu'>
                        {filterMenuContentsComponent}
                    </div>
                </div>}
            </FilterCallbackContext.Provider>
        </th> 
    );

    function FilterItemClick(condition) {
        setPopup(false);
        filterResultsCallback(ResultPropSelector, condition, label);
    }
}

export default ResultTableHeader;