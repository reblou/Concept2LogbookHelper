import { useState, useRef, React, useContext } from 'react';
import FilterMenu from "./FilterMenu";
import './ResultTableHeader.css';
import FilterButtonList from './FilterButtonList';
import { PopupContext } from '../Contexts/PopupContext.js';

function ResultTableHeader({label, filterMenuContentsComponent }) {
    const [popup, setPopup] = useState(false);
    //TODO: read filter callback context and add in the set popup

    return (
        <th>{label}<button className='FilterMenuButton' onClick={() => setPopup(!popup)} />
            <PopupContext.Provider value={FilterItemClick}>
            {popup &&
                <div>
                    <div className='PopupDisabler' onClick={() => setPopup(!popup)} />
                    <FilterMenu filterMenuContentsComponent={filterMenuContentsComponent} />
                    </div>}
            </PopupContext.Provider>
        </th> 
    );

    function FilterItemClick() {
        setPopup(false);
    }
}

export default ResultTableHeader;