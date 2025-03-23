import { useState, useContext } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';


function FilterComparisons({ InputFormatFunc, customInput: CustomInput, customEqualityFunc }) {
    const [dropDown, setDropDown] = useState(false);
    const [comparisonType, setComparisonType] = useState("Equal To");
    const [between, setBetween] = useState(false);
    const value1 = between ? "Value 1" : "Value";

    const [input1, setInput1] = useState();
    const [input2, setInput2] = useState();
    const [invalid, setInvalid] = useState(false);
    const [invalid2, setInvalid2] = useState(false);

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
                {CustomInput !== undefined ?
                    <CustomInput value={value1} search={SearchTyped} setInput={setInput1} failedSubmit={invalid} /> : 
                    <input autoFocus placeholder={value1} onKeyDown={SearchTyped} onInput={e => setInput1(e.target.value)} />}
          {between &&
              <>
                <p>And</p>
                    {CustomInput !== undefined ?
                        <CustomInput value={"Value 2"} search={SearchTyped} setInput={setInput2} failedSubmit={invalid2} /> :
                        <input autoFocus placeholder={"Value 2"} onKeyDown={SearchTyped} onInput={e => setInput2(e.target.value)} />}
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
        if (formatted1 === undefined) {
            setInvalid(true);
            return;
        }
        setInvalid(false);

        switch (comparisonType) {
            case "Equal To":
                var f = (property => property === formatted1)
                //override equality if function set
                if (customEqualityFunc !== undefined) f = (property => customEqualityFunc(property, formatted1));

                filterResultsCallback(f, "%prop% = " + input1);
                break;
            case "Greater Than":
                filterResultsCallback((property => property >= formatted1), "%prop% >= " + input1);
                break;
            case "Less Than":
                filterResultsCallback((property => property <= formatted1), "%prop% <= " + input1);
                break;
            case "Between":
                if (formatted2 === undefined) {
                    setInvalid2(true);
                    return;
                }
                setInvalid2(false);
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