import { useState } from 'react';
import "./FilterList.css";

function FilterList({ filterOptionList, onClick }) {
    const contents = filterOptionList === undefined
        ? <div />
        : <ul className='FilterList'>
            <li><button onClick={() => onClick('*')}>Clear Filter</button></li>
            {filterOptionList.map((value) => (<li key={value}><button onClick={() => onClick(value)}>{value}</button></li>))}
        </ul>;

        
    return (
        <div className='FilterListMenu'>
            {contents}
        </div>
    );
}

export default FilterList;