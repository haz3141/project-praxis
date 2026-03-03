import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, id, label, description, ...props },
  ref,
) {
  const reactId = useId();
  const inputId = id || `ds-checkbox-${reactId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <label className={["ds-checkbox", className].filter(Boolean).join(' ')} htmlFor={inputId}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="ds-checkbox-input"
        aria-describedby={descriptionId}
        {...props}
      />
      <span className="ds-checkbox-text">
        {label}
        {description ? (
          <span id={descriptionId} className="ds-checkbox-description">
            {' '}
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
});
