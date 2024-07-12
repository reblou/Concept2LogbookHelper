import { useState, useRef, useContext } from 'react';
import './FilterComparisons.css'
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';


function FilterComparisons({ InputFormatFunc }) {
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
                      <button onClick={() => { setComparisonType("="); setDropDown(false) }}>=</button>
                      <button onClick={() => { setComparisonType(">"); setDropDown(false) } }>{">"}</button>
                      <button onClick={() => { setComparisonType("<"); setDropDown(false) }}>{"<"}</button>
                    </div>
              </div>
          }
          <p>{comparisonType}</p>
          <input autoFocus placeholder='value' onKeyDown={SearchTyped} />
      </div>
    );

    function SearchTyped(e) {
        if (e.key === 'Enter') {

            var formattedValue = InputFormatFunc(e.target.value);
            switch (comparisonType) {
                case "=":
                    filterResultsCallback((property => property === formattedValue));
                    break;
                case ">":
                    filterResultsCallback((property => property >= formattedValue));
                    break;
                case "<":
                    filterResultsCallback((property => property <= formattedValue));
                    break;
                default:
                    filterResultsCallback((property => property === formattedValue));

            }
        }
    }
}

export default FilterComparisons;