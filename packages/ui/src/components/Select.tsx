import { forwardRef, useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, id, label, hint, error, options, placeholder, 'aria-describedby': ariaDescribedBy, ...props },
  ref,
) {
  const reactId = useId();
  const selectId = id || `ds-select-${reactId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="ds-field ds-select">
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
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
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
