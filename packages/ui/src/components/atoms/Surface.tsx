import type { HTMLAttributes } from 'react';

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'article' | 'div';
  elevated?: boolean;
}

export function Surface({ as = 'section', elevated = false, className, ...props }: SurfaceProps) {
  const Comp = as;
  return <Comp className={['ds-surface', elevated ? 'ds-surface--elevated' : '', className].filter(Boolean).join(' ')} {...props} />;
}
