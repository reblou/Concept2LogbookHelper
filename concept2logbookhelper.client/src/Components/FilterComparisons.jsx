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
            <select onChange={FilterMethodSelected}>
                <option value="Equal To">Equal To</option>
                <option value="Greater Than">Greater Than</option>
                <option value="Less Than">Less Than</option>
                <option value="Between">Between</option>
            </select>
          <input autoFocus placeholder='value' onKeyDown={SearchTyped} onInput={e => setInput1(e.target.value)} />
          {between &&
              <>
                <p>and</p>
                <input placeholder='value 2' onKeyDown={SearchTyped} onInput={e => setInput2(e.target.value)} />
              </>}
            </div>
          <button onClick={Filter}>Filter</button>

        </>
    );

    function FilterMethodSelected(e) {
        setComparisonType(e.target.value);
        setDropDown(false);
        setBetween(e.target.value === "Between");
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