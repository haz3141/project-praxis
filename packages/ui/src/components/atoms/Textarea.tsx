import { forwardRef, useId } from 'react';
import type { ReactNode, TextareaHTMLAttributes } from 'react';

export interface AtomicTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  density?: 'comfortable' | 'compact';
}

export const AtomicTextarea = forwardRef<HTMLTextAreaElement, AtomicTextareaProps>(function AtomicTextarea(
  { className, id, label, hint, error, density = 'comfortable', 'aria-describedby': ariaDescribedBy, ...props },
  ref,
) {
  const reactId = useId();
  const inputId = id || `ds-atomic-textarea-${reactId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="ds-field" data-density={density}>
      {label ? (
        <label className="ds-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        className={['ds-input ds-input--textarea', className].filter(Boolean).join(' ')}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      />
      {hint ? (
        <div id={hintId} className="ds-hint">
          {hint}
        </div>
      ) : null}
      {error ? (
        <div id={errorId} className="ds-hint ds-error" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
});
