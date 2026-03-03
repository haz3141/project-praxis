import type { ReactNode } from 'react';
import { AtomicCheckbox } from '../atoms/Checkbox';
import { TaskMeta } from '../molecules/TaskMeta';

export interface TaskRowProps {
  title: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  priority?: 'low' | 'medium' | 'high';
  due?: ReactNode;
  trailing?: ReactNode;
  density?: 'comfortable' | 'compact';
}

export function TaskRow({
  title,
  description,
  checked,
  onCheckedChange,
  priority = 'medium',
  due,
  trailing,
  density = 'comfortable',
}: TaskRowProps) {
  return (
    <div className="ds-task-row" data-density={density}>
      <AtomicCheckbox
        label={title}
        description={description}
        checked={checked}
        onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
      />
      <TaskMeta due={due} priority={priority} />
      {trailing ? <div>{trailing}</div> : null}
    </div>
  );
}
