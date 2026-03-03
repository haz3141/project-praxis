import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  side?: 'left' | 'right';
  children?: ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  children,
}: DrawerProps) {
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
    <div className="ds-drawer-host" role="presentation">
      <div className="ds-drawer-backdrop" onMouseDown={onClose} />
      <div
        ref={panelRef}
        className={`ds-drawer ds-drawer--${side}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className="ds-drawer-header">
          <h2 id={titleId} className="ds-drawer-title">
            {title}
          </h2>
          <button type="button" className="ds-drawer-close" aria-label="Close drawer" onClick={onClose}>
            ×
          </button>
        </header>
        {description ? (
          <p id={descriptionId} className="ds-drawer-description">
            {description}
          </p>
        ) : null}
        <div className="ds-drawer-body">{children}</div>
      </div>
    </div>
  );
}
