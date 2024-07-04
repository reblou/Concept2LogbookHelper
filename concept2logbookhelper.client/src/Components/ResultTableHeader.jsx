import { useState, useRef } from 'react';
import FilterList from "./FilterList";
import './ResultTableHeader.css';

function ResultTableHeader({label, filterMenuItems, filterCallback }) {
    const [popup, setPopup] = useState(false);

    return (
        <th>{label}<button className='FilterMenuButton' onClick={() => setPopup(!popup)} />
            {popup &&
                <div>
                    <div className='PopupDisabler' onClick={() => setPopup(!popup)} />
                    <FilterList filterOptionList={filterMenuItems} filterResultsCallback={FilterItemClick} />
                </div>}
        </th> 
    );

    function FilterItemClick(value, exact) {
        filterCallback(value, exact);
        setPopup(false);
    }
}

export default ResultTableHeader;