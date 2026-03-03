import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}

export function Dialog({ open, onClose, title, description, children, actions }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="ds-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="ds-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className="ds-dialog-header">
          <h2 id={titleId} className="ds-dialog-title">
            {title}
          </h2>
          <button type="button" className="ds-dialog-close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </header>
        {description ? (
          <p id={descriptionId} className="ds-dialog-description">
            {description}
          </p>
        ) : null}
        <div className="ds-dialog-body">{children}</div>
        {actions ? <footer className="ds-dialog-actions">{actions}</footer> : null}
      </div>
    </div>
  );
}
