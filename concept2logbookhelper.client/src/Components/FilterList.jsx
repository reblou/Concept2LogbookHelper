import { useState } from 'react';
import "./FilterList.css";

function FilterList({ filterOptionList, onClick }) {
    const [filterList, setFilterList] = useState();

    return (
        <ul className='FilterList'>
            {filterOptionList.map((value) => (<li key = {value}><button className='FilterButton' onClick={() => onClick(value)}>{value}</button></li>))}
            <li><button className='FilterButton' onClick={() => onClick('*')}>Clear</button></li>
        </ul>
    );


}

export default FilterList;