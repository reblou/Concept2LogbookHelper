import { useState, useContext } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';

function FilterButtonList({ filterOptionList }) {

    const filterResultsCallback = useContext(FilterCallbackContext);

    const contents = filterOptionList === undefined || filterOptionList.length <= 0
        ? <p>Loading...</p>
        : filterOptionList.map((value) => (<li key={value}><button onClick={() => filterResultsCallback(property  => property === value, value)}>{value}</button></li>))
        
    return (
        <>
            <input autoFocus type='text' placeholder="Search..." onKeyDown={SearchTyped}></input>
            <ul className='FilterList'>
                {contents }
            </ul>
        </>
    );


    function SearchTyped(e) {
        if (e.key === 'Enter') {
            filterResultsCallback(property => property.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1, "Contains " + e.target.value);
        }
    }
}

export default FilterButtonList;