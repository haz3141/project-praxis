import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="ds-empty-state">
      <h3 className="ds-card-title">{title}</h3>
      {description ? <p className="ds-card-description">{description}</p> : null}
      {action ? <div className="ds-empty-state-action">{action}</div> : null}
    </div>
  );
}
