import "../../css/FilterInput.css";
import { useRef, useState } from 'react';

function DateInput({ value, search, setInput, failedSubmit }) {
	const inputRef = useRef(null);

	return (<>
		{failedSubmit ? <label className="inputTooltip">Please input a valid date.</label> : <></>}
		<input ref={inputRef} autoFocus placeholder={"Date " + value} type="date" onKeyDown={search} onInput={e => validate(e.target.value)}/>
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

export default DateInput;