import type { HTMLAttributes } from 'react';

export type AtomicDividerOrientation = 'horizontal' | 'vertical';

export interface AtomicDividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: AtomicDividerOrientation;
  decorative?: boolean;
}

export function AtomicDivider({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}: AtomicDividerProps) {
  const classes = ['ds-divider', `ds-divider--${orientation}`, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role={decorative ? 'presentation' : 'separator'}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      {...props}
    />
  );
}
