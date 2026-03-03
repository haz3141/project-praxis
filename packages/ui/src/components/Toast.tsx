import type { ReactNode } from 'react';

export interface ToastProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  tone?: 'info' | 'success' | 'error';
  onClose?: () => void;
}

export function Toast({ open, title, description, tone = 'info', onClose }: ToastProps) {
  if (!open) {
    return null;
  }

  const role = tone === 'error' ? 'alert' : 'status';
  const ariaLive = tone === 'error' ? 'assertive' : 'polite';

  return (
    <div className={`ds-toast ds-toast--${tone}`} role={role} aria-live={ariaLive}>
      <header className="ds-toast-header">
        <p className="ds-toast-title">{title}</p>
        {onClose ? (
          <button type="button" className="ds-toast-close" aria-label="Dismiss notification" onClick={onClose}>
            ×
          </button>
        ) : null}
      </header>
      {description ? <p className="ds-toast-description">{description}</p> : null}
    </div>
  );
}
