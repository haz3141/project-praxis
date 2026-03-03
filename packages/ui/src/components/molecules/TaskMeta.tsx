import type { ReactNode } from 'react';
import { Badge } from '../atoms/Badge';

export interface TaskMetaProps {
  due?: ReactNode;
  priority?: 'low' | 'medium' | 'high';
  status?: ReactNode;
}

export function TaskMeta({ due, priority = 'medium', status }: TaskMetaProps) {
  const tone = priority === 'high' ? 'danger' : priority === 'low' ? 'neutral' : 'warning';
  return (
    <div className="ds-task-meta">
      {due ? <span className="ds-caption">Due {due}</span> : null}
      <Badge tone={tone}>{priority}</Badge>
      {status ? <span className="ds-caption">{status}</span> : null}
    </div>
  );
}
