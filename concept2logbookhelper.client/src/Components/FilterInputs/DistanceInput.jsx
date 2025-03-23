import "../../css/FilterInput.css";
import { useRef, useState } from 'react';

function DistanceInput({ value, search, setInput, failedSubmit }) {
	const inputRef = useRef(null);

	return (<>
		{failedSubmit ? <label className="inputTooltip">Please input a valid distance.</label> : <></>}
		<input ref={inputRef} autoFocus placeholder={"Distance " + value} onKeyDown={search} onInput={e => validate(e.target.value)} pattern="(\d+[.,]?)+[mM]?" />
		</>
  );

	function validate(value) {
		value = value.trim()

		value = value.replaceAll(",", "");
		value = value.replaceAll(".", "");
		value = value.replace(/[mM]/g, "");

		if (inputRef.current.validity.valid) {
			setInput(value);
		} else {
			setInput(undefined);
		}
	}
}

export default DistanceInput;