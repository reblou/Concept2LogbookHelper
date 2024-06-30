import { useState } from 'react';
import FilterList from "./FilterList";

function ResultTableHeader({label, filterMenuItems, filterCallback }) {
    const [popup, setPopup] = useState(false);

    return (
        <th>{label}<button className='FilterMenuButton' onClick={() => setPopup(!popup)} />
            {popup &&
                <FilterList filterOptionList={filterMenuItems} onClick={FilterItemClick} />}
        </th> 
    );

    function FilterItemClick(value) {
        filterCallback(value);
        setPopup(false);
    }
}

export default ResultTableHeader;