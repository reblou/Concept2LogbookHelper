import { useState, useContext } from 'react';
import { PopupContext } from '../Contexts/PopupContext.js';

function FilterButtonList({ filterOptionList, filterResultsCallback }) {
    const popupCallback = useContext(PopupContext);

    const contents = filterOptionList === undefined || filterOptionList.length <= 0
        ? <p>Loading...</p>
        : filterOptionList.map((value) => (<li key={value}><button onClick={() => {filterResultsCallback(value, true); popupCallback() }}>{value}</button></li>))
        
    return (
        <div>
            <input autoFocus type='text' placeholder="Search..." onKeyDown={SearchTyped}></input>
            <ul className='FilterList'>
                <li><button onClick={() => { filterResultsCallback('*', true); popupCallback()}}>Clear Filter</button></li>
                {contents }
            </ul>
        </div>
    );


    function SearchTyped(e) {
        if (e.key === 'Enter') {
            filterResultsCallback(e.target.value, false);
        }
    }
}

export default FilterButtonList;