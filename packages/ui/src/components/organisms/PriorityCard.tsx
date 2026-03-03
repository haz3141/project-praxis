import type { ReactNode } from 'react';

export interface PriorityCardProps {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  density?: 'comfortable' | 'compact';
}

export function PriorityCard({ title, description, meta, actions, density = 'comfortable' }: PriorityCardProps) {
  return (
    <section className="ds-priority-card" data-density={density}>
      <header className="ds-priority-card-header">
        <h3 className="ds-card-title">{title}</h3>
        {meta ? <div>{meta}</div> : null}
      </header>
      {description ? <p className="ds-card-description">{description}</p> : null}
      {actions ? <footer className="ds-priority-card-actions">{actions}</footer> : null}
    </section>
  );
}
