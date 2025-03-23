import "../../css/FilterInput.css";
import { useRef, useState } from 'react';

function NumericInput({ value, search, setInput, failedSubmit }) {
	const inputRef = useRef(null);

	return (<>
		{failedSubmit ? <label className="inputTooltip">Please input a valid number.</label> : <></>}
		<input ref={inputRef} autoFocus placeholder={"Number " + value} onKeyDown={search} onInput={e => validate(e.target.value)} pattern="\s*\d+\s*" />
		</>
  );

	function validate(value) {
		value = value.trim()

		if (inputRef.current.validity.valid) {
			setInput(value);
		} else {
			setInput(undefined);
		}
	}
}

export default NumericInput;