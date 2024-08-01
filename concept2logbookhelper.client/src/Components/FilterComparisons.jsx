import { useState, useRef, useContext } from 'react';
import './FilterComparisons.css'
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';


function FilterComparisons({ InputFormatFunc }) {
    const [dropDown, setDropDown] = useState(false);
    const [comparisonType, setComparisonType] = useState("Equal To");
    const [between, setBetween] = useState(false);

    const filterResultsCallback = useContext(FilterCallbackContext);

  return (
      <div>
          <button className="FilterComparisonButton"  onClick={() => setDropDown(!dropDown)}>{comparisonType}</button>
          {dropDown &&
              <div className='above'>
                  <div onClick={() => setDropDown(!dropDown)} />
                  <div className='FilterByDropDown'>
                      <button className="FilterComparisonButton" onClick={FilterMethodSelected}>Equal To</button>
                      <button className="FilterComparisonButton" onClick={FilterMethodSelected}>Greater Than</button>
                      <button className="FilterComparisonButton" onClick={FilterMethodSelected}>Less Than</button>
                      <button className="FilterComparisonButton" onClick={FilterMethodSelected}>Between</button>
                    </div>
              </div>
          }
          <input autoFocus placeholder='value' onKeyDown={SearchTyped} />
          {between && <input placeholder='value 2' onKeyDown={SearchTyped}/>}
      </div>
    );

    function FilterMethodSelected(e) {
        setComparisonType(e.target.textContent);
        setDropDown(false);
        setBetween(e.target.textContent === "Between");
    }

    function SearchTyped(e) {
        if (e.key === 'Enter') {

            var formattedValue = InputFormatFunc(e.target.value);
            switch (comparisonType) {
                case "Equal To":
                    filterResultsCallback((property => property === formattedValue));
                    break;
                case "Greater Than":
                    filterResultsCallback((property => property >= formattedValue));
                    break;
                case "Less Than":
                    filterResultsCallback((property => property <= formattedValue));
                    break;
                case "Between":
                    //TODO: get value of both inputs and filter property between those 2
                    break;
                default:
                    filterResultsCallback((property => property === formattedValue));

            }
        }
    }
}

export default FilterComparisons;