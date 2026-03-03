import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface AtomicSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
}

export const AtomicSwitch = forwardRef<HTMLInputElement, AtomicSwitchProps>(function AtomicSwitch(
  { className, id, label, description, ...props },
  ref,
) {
  const reactId = useId();
  const inputId = id || `ds-switch-${reactId}`;
  return (
    <label className={['ds-switch', className].filter(Boolean).join(' ')} htmlFor={inputId}>
      <span className="ds-switch-meta">
        <span className="ds-switch-label">{label}</span>
        {description ? <span className="ds-switch-description">{description}</span> : null}
      </span>
      <span className="ds-switch-control">
        <input ref={ref} id={inputId} type="checkbox" className="ds-switch-input" {...props} />
        <span className="ds-switch-track" aria-hidden="true" />
      </span>
    </label>
  );
});
