import { useState, useRef, useContext } from 'react';
import './FilterComparisons.css'
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';


function FilterComparisons() {
    const [dropDown, setDropDown] = useState(false);

    const filterResultsCallback = useContext(FilterCallbackContext);

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
        }
    }
}

export default FilterComparisons;