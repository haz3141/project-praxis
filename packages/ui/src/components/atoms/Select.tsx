import { forwardRef, useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

export interface AtomicSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface AtomicSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options: AtomicSelectOption[];
  density?: 'comfortable' | 'compact';
}

export const AtomicSelect = forwardRef<HTMLSelectElement, AtomicSelectProps>(function AtomicSelect(
  { className, id, label, hint, error, options, density = 'comfortable', 'aria-describedby': ariaDescribedBy, ...props },
  ref,
) {
  const reactId = useId();
  const selectId = id || `ds-atomic-select-${reactId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="ds-field ds-select" data-density={density}>
      {label ? (
        <label className="ds-label" htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className={['ds-select-control', className].filter(Boolean).join(' ')}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
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
