import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface AtomicCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
  density?: 'comfortable' | 'compact';
}

export const AtomicCheckbox = forwardRef<HTMLInputElement, AtomicCheckboxProps>(function AtomicCheckbox(
  { className, id, label, description, density = 'comfortable', ...props },
  ref,
) {
  const reactId = useId();
  const inputId = id || `ds-atomic-checkbox-${reactId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <label className={['ds-checkbox', className].filter(Boolean).join(' ')} htmlFor={inputId} data-density={density}>
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
