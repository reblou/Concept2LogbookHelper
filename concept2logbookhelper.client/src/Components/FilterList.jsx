import { useState, useRef} from 'react';
import "./FilterList.css";

function FilterList({ filterOptionList, onClick }) {
    const [filterOptions, setFilterOptions] = useState(filterOptionList);
    const fullOptions = useRef(filterOptionList);

    const contents = filterOptionList === undefined
        ? <div />
        : <ul className='FilterList'>
            <li><button onClick={() => onClick('*')}>Clear Filter</button></li>
            {filterOptions.map((value) => (<li key={value}><button onClick={() => onClick(value)}>{value}</button></li>))}
        </ul>;

        
    return (
        <div className='FilterListMenu'>
            <input type='text' placeholder="Search..." onInput={SearchTyped}></input>
            {contents}
        </div>
    );

    function SearchTyped(e) {
        setFilterOptions(fullOptions.current.filter(option => option.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1));
    }
}

export default FilterList;