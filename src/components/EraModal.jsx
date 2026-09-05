import { useEffect, useRef, useState } from 'react';
import '../styles/EraModal.css';

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   titleId: string,
 *   children: React.ReactNode,
 *   className?: string
 * }} props Reusable modal shell with accessible close behavior and animated panel state.
 */
function EraModal({ isOpen, onClose, titleId, children, className = '' }) {
  const [isPresent, setIsPresent] = useState(isOpen);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsPresent(true);
      window.setTimeout(() => closeButtonRef.current?.focus(), 80);
      return undefined;
    }

    const timeout = window.setTimeout(() => setIsPresent(false), 760);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isPresent) return null;

  return (
    <div
      className={`era-modal${isOpen ? ' is-open' : ''}${className ? ` ${className}` : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button className="era-modal__overlay" type="button" aria-label="Close modal" onClick={onClose} />
      <section className="era-modal__panel" data-modal-panel>
        <button className="era-modal__close" type="button" aria-label="Close modal" onClick={onClose} ref={closeButtonRef}>
          <span aria-hidden="true">×</span>
        </button>
        {children}
      </section>
    </div>
  );
}

export default EraModal;
