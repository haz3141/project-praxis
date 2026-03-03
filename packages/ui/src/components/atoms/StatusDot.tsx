import type { HTMLAttributes } from 'react';

export type AtomicStatusDotTone = 'neutral' | 'success' | 'warning' | 'error' | 'sync';
export type AtomicStatusDotSize = 'sm' | 'md';

export interface AtomicStatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: AtomicStatusDotTone;
  size?: AtomicStatusDotSize;
  decorative?: boolean;
}

export function AtomicStatusDot({
  tone = 'neutral',
  size = 'md',
  decorative = true,
  className,
  ...props
}: AtomicStatusDotProps) {
  const classes = ['ds-status-dot', `ds-status-dot--${tone}`, `ds-status-dot--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} {...props} {...(decorative ? { role: 'presentation', 'aria-hidden': true } : {})} />;
}
