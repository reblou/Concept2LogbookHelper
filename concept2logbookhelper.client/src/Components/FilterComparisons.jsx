import { useState, useRef, useContext } from 'react';
import './FilterComparisons.css'
import { PopupContext } from '../Contexts/PopupContext';

//TODO: pass whole callback as context? 
function FilterComparisons({ filterResultsCallback }) {
    const [dropDown, setDropDown] = useState(false);
    const popupCallback = useContext(PopupContext);

  return (
      <div>
          <button onClick={() => setDropDown(!dropDown) }>Filter By</button>
          {dropDown &&
              <div>
                  <div onClick={() => setDropDown(!dropDown)} />
                  <div className='FilterByDropDown'>
                      <button>=</button>
                      <button>{">"}</button>
                      <button>{"<"}</button>
                    </div>
              </div>
          }
          <input autoFocus placeholder='value' onKeyDown={SearchTyped} />
      </div>
    );

    function SearchTyped(e) {
        if (e.key === 'Enter') {
            filterResultsCallback(e.target.value, false);
            popupCallback();
        }
    }
}

export default FilterComparisons;