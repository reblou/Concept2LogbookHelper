import "../../css/FilterInput.css";
import { useRef } from 'react';

function TimeInput({ value, search, setInput }) {
	const inputRef = useRef(null);

	return (
		<input ref={inputRef}  autoFocus placeholder={"Custom" + value} onKeyDown={search} onInput={e => validate(e.target.value)} pattern="\d{1,2}:\d{2}(:\d{2})?(\.\d+)?\s*"/>
  );

	function validate(value) {
		//todo: display some indication of input format e.g. 2:00 is 2minutes 1:00:00 is 1 hr
		value = value.trim()

		if (value[0] != "0") {
			value = "0" + value;
		}

		if (inputRef.current.validity.valid) {
			setInput(value);
		} else {
			setInput(undefined);
		}
	}
}

export default TimeInput;