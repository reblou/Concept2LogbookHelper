import { useState, useRef} from 'react';
import "./FilterList.css";

function FilterList({ filterOptionList, filterResultsCallback }) {
    const contents = filterOptionList === undefined
        ? <div />
        : <ul className='FilterList'>
            <li><button onClick={() => filterResultsCallback('*', true)}>Clear Filter</button></li>
            {filterOptionList.map((value) => (<li key={value}><button onClick={() => filterResultsCallback(value, true)}>{value}</button></li>))}
        </ul>;

        
    return (
        <div className='FilterListMenu'>
            <input autoFocus type='text' placeholder="Search..." onKeyDown={SearchTyped}></input>
            {contents}
        </div>
    );

    function SearchTyped(e) {
        if (e.key === 'Enter') {
            filterResultsCallback(e.target.value, false);
        }
    }
}

export default FilterList;