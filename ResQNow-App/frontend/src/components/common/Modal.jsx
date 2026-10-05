// src/components/common/Modal.jsx

import {
  useEffect,
  useRef,
} from 'react';

import {
  createPortal,
} from 'react-dom';

// ============ FOCUSABLE ELEMENTS ============
// Used to keep keyboard focus inside the modal.
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// ============ MODAL ============
// Shared modal for Resident screens.
//
// Important:
// This uses React Portal so the modal is rendered
// directly under <body>, outside ResidentLayout's
// page and bottom-navigation stacking contexts.
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  isBusy = false,
}) {
  const dialogRef =
    useRef(null);

  const previousFocusRef =
    useRef(null);

  // ============ BODY SCROLL LOCK ============
  // Prevent the page behind the modal from scrolling.
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousFocusRef.current =
      document.activeElement;

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style
        .overflow;

    document.body.style.overflow =
      'hidden';

    document.documentElement.style.overflow =
      'hidden';

    // Move focus into the modal.
    requestAnimationFrame(() => {
      const dialog =
        dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusable =
        dialog.querySelector(
          FOCUSABLE_SELECTOR
        );

      if (focusable) {
        focusable.focus();
      } else {
        dialog.focus();
      }
    });

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousHtmlOverflow;

      // Return keyboard focus to
      // the control that opened the modal.
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current
          .focus === 'function'
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  // ============ KEYBOARD CONTROL ============
  // Escape closes the modal.
  // Tab stays trapped inside the modal.
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      const dialog =
        dialogRef.current;

      if (!dialog) {
        return;
      }

      // Close using Escape.
      if (
        event.key === 'Escape' &&
        closeOnEscape &&
        !isBusy
      ) {
        event.preventDefault();
        onClose?.();
        return;
      }

      // Keep Tab focus inside the dialog.
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements =
        Array.from(
          dialog.querySelectorAll(
            FOCUSABLE_SELECTOR
          )
        );

      if (
        focusableElements.length === 0
      ) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement =
        focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    open,
    closeOnEscape,
    isBusy,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  // ============ BACKDROP ============
  const handleBackdropClick = (
    event
  ) => {
    // Only close when the resident
    // clicks the actual backdrop.
    //
    // Clicking anywhere inside the
    // dialog should never close it.
    if (
      event.target !==
      event.currentTarget
    ) {
      return;
    }

    if (
      closeOnBackdrop &&
      !isBusy
    ) {
      onClose?.();
    }
  };

  const modal = (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-end
        sm:items-center
        justify-center
        bg-resqnow-primary/45
        p-0
        sm:p-4
        overscroll-none
      "
      onMouseDown={
        handleBackdropClick
      }
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resqnow-modal-title"
        aria-describedby={
          description
            ? 'resqnow-modal-description'
            : undefined
        }
        tabIndex={-1}
        className="
          w-full
          max-w-md
          max-h-[90dvh]
          bg-white
          rounded-t-3xl
          sm:rounded-2xl
          shadow-2xl
          overflow-hidden
          outline-none
        "
      >
        {/* ============ HEADER ============ */}
        {(title ||
          description) && (
          <div className="px-4 py-3 border-b border-resqnow-border-soft">

            {title && (
              <h2
                id="resqnow-modal-title"
                className="text-base font-bold text-resqnow-primary"
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                id="resqnow-modal-description"
                className="text-[12px] text-resqnow-muted mt-1 leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* ============ SCROLLABLE CONTENT ============ */}
        <div
          className="
            max-h-[calc(90dvh-72px)]
            overflow-y-auto
            overscroll-contain
            touch-pan-y
          "
        >
          {children}
        </div>
      </div>
    </div>
  );

  // Render outside ResidentLayout.
  return createPortal(
    modal,
    document.body
  );
}
