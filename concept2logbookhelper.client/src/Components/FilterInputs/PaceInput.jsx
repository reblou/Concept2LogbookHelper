import "../../css/FilterInput.css";
import { useRef, useState } from 'react';

function PaceInput({ value, search, setInput, failedSubmit }) {
	const inputRef = useRef(null);

	return (<>
		{failedSubmit ? <label className="inputTooltip">Input Format: MM:SS.ms</label> : <></>}
		<input ref={inputRef} autoFocus placeholder={"Pace " + value} onKeyDown={search} onInput={e => validate(e.target.value)} pattern="\d{1,2}:\d{2}(\.\d+)?\s*" />
		</>
  );

	function validate(value) {
		value = value.trim()

		if (value.indexOf(":") == 1 && value[0] != "0") {
			value = "0" + value;
		}

		if (inputRef.current.validity.valid) {
			setInput(value);
		} else {
			setInput(undefined);
		}
	}
}

export default PaceInput;