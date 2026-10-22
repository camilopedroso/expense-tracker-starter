import { useEffect, useId, useRef } from 'react'

// Native modal <dialog>: the browser traps focus, makes the page behind it inert and closes it on Esc.
// `openerRef` holds the element that opened the modal; it's passed in because Safari doesn't focus
// buttons on click, so document.activeElement would just be <body>.
function ConfirmModal({ message, onConfirm, onCancel, openerRef, fallbackFocusRef }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const pressedBackdrop = useRef(false);
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = openerRef?.current;
    const fallback = fallbackFocusRef?.current;
    if (!dialog.open) dialog.showModal();
    cancelRef.current.focus();

    // Runs after the dialog leaves the DOM. If the opener went away too (its row was deleted),
    // move focus to a stable fallback instead of letting it drop to <body>.
    return () => {
      const target = opener?.isConnected ? opener : fallback;
      target?.focus();
    };
  }, [openerRef, fallbackFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={messageId}
      onClose={onCancel}
      // The dialog has no padding, so the element itself is only hit on the backdrop. Require both
      // press and release there: dragging a text selection out of the dialog also clicks the <dialog>.
      onMouseDown={(e) => { pressedBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) onCancel();
        pressedBackdrop.current = false;
      }}
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
