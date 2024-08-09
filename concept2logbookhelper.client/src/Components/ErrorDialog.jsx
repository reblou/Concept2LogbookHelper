import { useEffect, useState, useRef, Suspense } from "react";
import { useNavigate } from 'react-router-dom'

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
          <h3>Error</h3>
          <p>Error fetching logbook data. Please retry.</p>
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