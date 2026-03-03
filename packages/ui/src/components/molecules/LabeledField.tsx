import type { ReactNode } from 'react';

export interface LabeledFieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}

export function LabeledField({ label, hint, error, htmlFor, children }: LabeledFieldProps) {
  return (
    <div className="ds-field-group">
      <label className="ds-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <p className="ds-hint">{hint}</p> : null}
      {error ? (
        <p className="ds-hint ds-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
