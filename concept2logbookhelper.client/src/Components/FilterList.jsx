import { useState } from 'react';

function FilterList({ filterOptionList, onClick }) {
    const [filterList, setFilterList] = useState();

    return (
        <div>
            {filterOptionList.map((value) => (<button key={value} onClick={() => onClick(value)}>{value}</button>))}
            <button onClick={() => onClick('*')}>Clear</button>
        </div>
    );


}

export default FilterList;