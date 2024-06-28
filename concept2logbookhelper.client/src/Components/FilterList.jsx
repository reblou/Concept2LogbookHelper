import { useState } from 'react';
import "./FilterList.css";

function FilterList({ filterOptionList, onClick }) {
    const [filterList, setFilterList] = useState();

    return (
        <div className='FilterListMenu'>
            <ul className='FilterList'>
                {filterOptionList.map((value) => (<li key={value}><button onClick={() => onClick(value)}>{value}</button></li>))}
                <li><button onClick={() => onClick('*')}>Clear</button></li>
            </ul>
        </div>
    );


}

export default FilterList;