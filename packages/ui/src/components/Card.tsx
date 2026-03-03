import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  as?: 'section' | 'article' | 'div';
}

export function Card({ as = 'section', className, title, description, children, ...props }: CardProps) {
  const Comp = as;

  return (
    <Comp className={['ds-card', className].filter(Boolean).join(' ')} {...props}>
      {title ? <h3 className="ds-card-title">{title}</h3> : null}
      {description ? <p className="ds-card-description">{description}</p> : null}
      <div className="ds-card-content">{children}</div>
    </Comp>
  );
}
