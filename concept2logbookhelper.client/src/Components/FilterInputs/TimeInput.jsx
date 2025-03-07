import "../../css/FilterInput.css";
import { useRef, useState } from 'react';

function TimeInput({ value, search, setInput }) {
	const inputRef = useRef(null);
	const [invalid, setInvalid] = useState(false);

	return (<>
		{invalid ? <label className="inputTooltip">Input Format: (HH:)MM:SS.ms</label> : <></>}
		<input ref={inputRef} autoFocus placeholder={"Custom" + value} onKeyDown={search} onInput={e => validate(e.target.value)} pattern="\d{1,2}:\d{2}(:\d{2})?(\.\d+)?\s*"/>
		</>
  );

	function validate(value) {
		value = value.trim()

		if (value.indexOf(":") == 1 && value[0] != "0") {
			value = "0" + value;
		}

		setInvalid(!inputRef.current.validity.valid);
		if (inputRef.current.validity.valid) {
			setInput(value);
		} else {
			setInput(undefined);
		}
	}
}

export default TimeInput;