import { useState, useRef, useContext } from 'react';
import './FilterComparisons.css'
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';


function FilterComparisons() {
    const [dropDown, setDropDown] = useState(false);
    const [comparisonType, setComparisonType] = useState("=");

    const filterResultsCallback = useContext(FilterCallbackContext);


  return (
      <div>
          <button onClick={() => setDropDown(!dropDown) }>Filter By</button>
          {dropDown &&
              <div>
                  <div onClick={() => setDropDown(!dropDown)} />
                  <div className='FilterByDropDown'>
                      <button onClick={() => setComparisonType("=")}>=</button>
                      <button onClick={() => setComparisonType(">") }>{">"}</button>
                      <button onClick={() => setComparisonType("<")}>{"<"}</button>
                    </div>
              </div>
          }
          <p>{comparisonType}</p>
          <input autoFocus placeholder='value' onKeyDown={SearchTyped} />
      </div>
    );

    function SearchTyped(e) {
        if (e.key === 'Enter') {
            switch (comparisonType) {
                case "=":
                    filterResultsCallback((property => property === + e.target.value));
                    break;
                case ">":
                    filterResultsCallback((property => property >= + e.target.value));
                    break;
                case "<":
                    filterResultsCallback((property => property <= + e.target.value));
                    break;
                default:
                    filterResultsCallback((property => property === + e.target.value));

            }
        }
    }
}

export default FilterComparisons;