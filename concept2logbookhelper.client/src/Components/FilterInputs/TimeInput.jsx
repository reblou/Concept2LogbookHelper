import "../../css/FilterInput.css";

function TimeInput({ value, search, setInput }) {
	return (
		<input autoFocus placeholder={"Hello " + value} onKeyDown={search} onInput={e => setInput(e.target.value)} onChange={e => validate(e.target.value)} pattern="\d{1, 2}:\d{2}(:\d{2})?(\.\d+)?"/>
  );

	function validate(value) {
		//todo: display some indication of input format e.g. 2:00 is 2minutes 1:00:00 is 1 hr
		// - don't allow submit on invalid inputs
		// clean input on missing leading 0s , whitespace, etc.

		setInput(value);
	}
}

export default TimeInput;