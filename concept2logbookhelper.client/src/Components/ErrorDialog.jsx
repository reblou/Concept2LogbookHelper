import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { PropTypes } from 'prop-types';

function ErrorDialog({ open }) {
    const errorDialog = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            errorDialog.current?.showModal();
        } else {
            errorDialog.current?.close();
        }
    }, [open, navigate])

  return (
      <dialog ref={errorDialog}>
          <h3>An Error Occured</h3>
          <p>There was an error fetching workout data. <br/> Please retry.</p>
          <button onClick={closeDialog}>Ok</button>
      </dialog>
    );

    async function closeDialog()
    {
        open = false;        
        navigate('/');
    }
}

export default ErrorDialog;