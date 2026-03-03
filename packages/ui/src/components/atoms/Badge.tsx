import type { HTMLAttributes } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  const toneClass = tone === 'neutral' ? 'ds-badge--neutral' : `ds-badge--${tone}`;
  return <span className={['ds-badge', toneClass, className].filter(Boolean).join(' ')} {...props} />;
}
