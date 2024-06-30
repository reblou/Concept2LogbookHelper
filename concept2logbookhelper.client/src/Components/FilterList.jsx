import { useState } from 'react';
import "./FilterList.css";

function FilterList({ filterOptionList, onClick }) {
    const contents = filterOptionList === undefined
        ? <div />
        :<ul className='FilterList'>
            {filterOptionList.map((value) => (<li key={value}><button onClick={() => onClick(value)}>{value}</button></li>))}
            <li><button onClick={() => onClick('*')}>Clear</button></li>
        </ul>;


    return (
        <div className='FilterListMenu'>
            {contents}
        </div>
    );
}

export default FilterList;