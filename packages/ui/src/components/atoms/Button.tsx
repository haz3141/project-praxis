import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type AtomicButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type DensityMode = 'comfortable' | 'compact';

export interface AtomicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AtomicButtonVariant;
  density?: DensityMode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
}

export const AtomicButton = forwardRef<HTMLButtonElement, AtomicButtonProps>(function AtomicButton(
  {
    className,
    type = 'button',
    variant = 'primary',
    density = 'comfortable',
    leadingIcon,
    trailingIcon,
    loading,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const classNames = ['ds-button', `ds-button--${variant}`, className].filter(Boolean).join(' ');
  return (
    <button
      ref={ref}
      type={type}
      className={classNames}
      data-density={density}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {leadingIcon ? <span className="ds-button-icon">{leadingIcon}</span> : null}
      <span>{loading ? 'Loading…' : children}</span>
      {trailingIcon ? <span className="ds-button-icon">{trailingIcon}</span> : null}
    </button>
  );
});
