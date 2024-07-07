import { useState, useRef } from 'react';
import FilterMenu from "./FilterMenu";
import './ResultTableHeader.css';
import FilterButtonList from './FilterButtonList';

function ResultTableHeader({label, filterMenuContentsComponent }) {
    const [popup, setPopup] = useState(false);

    return (
        <th>{label}<button className='FilterMenuButton' onClick={() => setPopup(!popup)} />
            {popup &&
                <div>
                    <div className='PopupDisabler' onClick={() => setPopup(!popup)} />
                    <FilterMenu filterMenuContentsComponent={filterMenuContentsComponent} />
                </div>}
        </th> 
    );

    function FilterItemClick(value, exact) {
        filterCallback(value, exact);
        setPopup(false);
    }
}

export default ResultTableHeader;