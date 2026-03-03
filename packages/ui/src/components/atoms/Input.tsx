import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface AtomicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  density?: 'comfortable' | 'compact';
}

export const AtomicInput = forwardRef<HTMLInputElement, AtomicInputProps>(function AtomicInput(
  { className, id, label, hint, error, density = 'comfortable', 'aria-describedby': ariaDescribedBy, ...props },
  ref,
) {
  const reactId = useId();
  const inputId = id || `ds-atomic-input-${reactId}`;
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
      <input
        ref={ref}
        id={inputId}
        className={['ds-input', className].filter(Boolean).join(' ')}
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
