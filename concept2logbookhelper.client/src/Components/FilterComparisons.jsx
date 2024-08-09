import { useState, useContext } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';


function FilterComparisons({ InputFormatFunc }) {
    const [dropDown, setDropDown] = useState(false);
    const [comparisonType, setComparisonType] = useState("Equal To");
    const [between, setBetween] = useState(false);

    const [input1, setInput1] = useState();
    const [input2, setInput2] = useState();

    const filterResultsCallback = useContext(FilterCallbackContext);

    return (
      <>
      <div className="FilterComparisonsDiv">
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
          <input autoFocus placeholder='value' onKeyDown={SearchTyped} onInput={e => setInput1(e.target.value)} />
          {between &&
              <>
              <p>and</p>
                  <input placeholder='value 2' onKeyDown={SearchTyped} onInput={e => setInput2(e.target.value)} /></>}
            </div>
          <button onClick={Filter}>Filter</button>

        </>
    );

    function FilterMethodSelected(e) {
        setComparisonType(e.target.textContent);
        setDropDown(false);
        setBetween(e.target.textContent === "Between");
    }

    function Filter() {
        var formatted1 = InputFormatFunc(input1);
        var formatted2 = InputFormatFunc(input2);
        switch (comparisonType) {
            case "Equal To":
                filterResultsCallback((property => property === formatted1));
                break;
            case "Greater Than":
                filterResultsCallback((property => property >= formatted1));
                break;
            case "Less Than":
                filterResultsCallback((property => property <= formatted1));
                break;
            case "Between":
                filterResultsCallback((property => formatted1 <= property && property <= formatted2));
                break;
            default:
                filterResultsCallback((property => property === formatted1));
        }
    }

    function SearchTyped(e) {
        if (e.key !== 'Enter') return;

        Filter();
    }
}

export default FilterComparisons;