import { useState, useRef, React, useContext } from 'react';
import filterImage from '/assets/filter.svg';
import sortImage from '/assets/bar-chart-2.svg';
import '../css/ResultTableHeader.css';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';
import { SortCallbackContext } from '../Contexts/SortCallbackContext.js';

function ResultTableHeader({label, filterMenuContentsComponent, ResultPropSelector }) {
    const [popup, setPopup] = useState(false);
    const filterResultsCallback = useContext(FilterCallbackContext);
    const sortResultsCallback = useContext(SortCallbackContext);

    return (
        <th>
            <FilterCallbackContext.Provider value={FilterItemClick}>
                {popup &&
                    <>
						<div className='FilterListMenu'>
							{filterMenuContentsComponent}
						</div>
						<div className='above'>
							<div className='PopupDisabler' onClick={() => setPopup(!popup)} />
						</div>
					</>
                }

            </FilterCallbackContext.Provider>
            
            <div className='FilterHeaderItems'>
                <label>{label}</label>
                {filterMenuContentsComponent !== undefined ?  
                    <div className='FilterButtonContainer'>

                        <button className='FilterMenuButton' onClick={() => setPopup(!popup)} >
                            <img className='icon-image' src ={filterImage} />
                        </button>

                    </div>
                : <></>}
                <button className='FilterMenuButton' onClick={() => sortResultsCallback(ResultPropSelector, label)} >
                    <img className='icon-image' src={sortImage} />
                </button>
            </div>
        </th> 
    );

    function FilterItemClick(condition, desc) {
        setPopup(false);
        desc = desc.replace("%prop%", label);
        filterResultsCallback(ResultPropSelector, condition, label, desc);
    }
}

export default ResultTableHeader;