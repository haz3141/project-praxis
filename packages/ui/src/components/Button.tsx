import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, type = 'button', variant = 'primary', ...props },
  ref,
) {
  const classNames = ['ds-button', `ds-button--${variant}`, className].filter(Boolean).join(' ');

  return <button ref={ref} type={type} className={classNames} {...props} />;
});
