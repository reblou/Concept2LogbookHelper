import { useState, useRef, React, useContext } from 'react';
import '../css/ResultTableHeader.css';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';
import { SortCallbackContext } from '../Contexts/SortCallbackContext.js';

function ResultTableHeader({label, filterMenuContentsComponent, ResultPropSelector }) {
    const [popup, setPopup] = useState(false);
    const filterResultsCallback = useContext(FilterCallbackContext);
    const sortResultsCallback = useContext(SortCallbackContext);

    return (
        <th>
            <div className='FilterHeader'>
                <label>{label}</label>
                {filterMenuContentsComponent !== undefined ?  
                    <>
                    <button className='FilterMenuButton' onClick={() => setPopup(!popup)} >
                        <img className='icon-image' src ='src/assets/filter.svg' />
                    </button>
                        <FilterCallbackContext.Provider value={FilterItemClick}>
                        {popup &&
                            <div className='above'>
                                <div className='PopupDisabler' onClick={() => setPopup(!popup)} />
                                <div className='FilterListMenu'>
                                    <button onClick={() => FilterItemClick(()=>true)}>Clear Filter</button>
                                    {filterMenuContentsComponent}
                                </div>
                            </div>}
                        </FilterCallbackContext.Provider>
                    </>
                    : <></>}
                <button className='FilterMenuButton' onClick={() => sortResultsCallback(ResultPropSelector)} >
                    <img className='icon-image' src='src/assets/bar-chart-2.svg' />
                </button>
            </div>
        </th> 
    );

    function FilterItemClick(condition) {
        setPopup(false);
        filterResultsCallback(ResultPropSelector, condition, label);
    }
}

export default ResultTableHeader;