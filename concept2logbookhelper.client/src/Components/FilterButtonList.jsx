import { useState, useContext } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';

function FilterButtonList({ filterOptionList }) {

    const filterResultsCallback = useContext(FilterCallbackContext);

    const contents = filterOptionList === undefined || filterOptionList.length <= 0
        ? <p>Loading...</p>
        : filterOptionList.map((value) => (<li key={value}><button onClick={() => filterResultsCallback(value, true)}>{value}</button></li>))
        
    return (
        <div>
            <input autoFocus type='text' placeholder="Search..." onKeyDown={SearchTyped}></input>
            <ul className='FilterList'>
                <li><button onClick={() => filterResultsCallback('*', true)}>Clear Filter</button></li>
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