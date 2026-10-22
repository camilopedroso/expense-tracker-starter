import { useEffect, useId, useRef, useState } from 'react'

// Native modal <dialog>: the browser traps focus, makes the page behind it inert and closes it on Esc.
function ConfirmModal({ message, onConfirm, onCancel, fallbackFocusRef }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const messageId = useId();
  // Read at render, before the dialog takes focus, so it is the element that opened the modal.
  const [opener] = useState(() => document.activeElement);

  useEffect(() => {
    const dialog = dialogRef.current;
    const fallback = fallbackFocusRef?.current;
    if (!dialog.open) dialog.showModal();
    cancelRef.current.focus();

    // Runs after the dialog leaves the DOM. If the opener went away too (its row was deleted),
    // move focus to a stable fallback instead of letting it drop to <body>.
    return () => {
      const target = opener?.isConnected ? opener : fallback;
      target?.focus();
    };
  }, [opener, fallbackFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={messageId}
      onClose={onCancel}
      // The dialog has no padding, so a click on the element itself is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-body">
        <p id={messageId}>{message}</p>
        <div className="modal-actions">
          <button ref={cancelRef} className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmModal
