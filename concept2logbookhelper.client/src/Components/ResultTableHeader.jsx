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
                    <FilterList filterOptionList={filterMenuItems} onClick={FilterItemClick} />
                </div>}
        </th> 
    );

    function FilterItemClick(value) {
        filterCallback(value);
        setPopup(false);
    }
}

export default ResultTableHeader;