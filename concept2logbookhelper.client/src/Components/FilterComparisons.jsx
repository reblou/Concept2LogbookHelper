import { useState, useContext } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';


function FilterComparisons({ InputFormatFunc, customInput: CustomInput }) {
    const [dropDown, setDropDown] = useState(false);
    const [comparisonType, setComparisonType] = useState("Equal To");
    const [between, setBetween] = useState(false);
    const value1 = between ? "Value 1" : "Value";

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
                {CustomInput !== undefined ? <CustomInput value={value1} search={SearchTyped} setInput={setInput1} /> : <input autoFocus placeholder={value1} onKeyDown={SearchTyped} onInput={e => setInput1(e.target.value)} />}
          {between &&
              <>
                <p>And</p>
                <input placeholder='Value 2' onKeyDown={SearchTyped} onInput={e => setInput2(e.target.value)} />
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
        //TODO: add string label here e.g. Pace < 2:00
        switch (comparisonType) {
            case "Equal To":
                filterResultsCallback((property => property === formatted1), "%prop% = " + input1);
                break;
            case "Greater Than":
                filterResultsCallback((property => property >= formatted1), "%prop% >= " + input1);
                break;
            case "Less Than":
                filterResultsCallback((property => property <= formatted1), "%prop% <= " + input1);
                break;
            case "Between":
                filterResultsCallback((property => formatted1 <= property && property <= formatted2), input1 + " <= %prop% <= " + input2);
                break;
            default:
                filterResultsCallback((property => property === formatted1), "%prop% = " + input1);
        }
    }

    function SearchTyped(e) {
        if (e.key !== 'Enter') return;

        Filter();
    }
}

export default FilterComparisons;