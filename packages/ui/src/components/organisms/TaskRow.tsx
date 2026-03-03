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
  className?: string;
  disabled?: boolean;
  loading?: boolean;
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
  className,
  disabled,
  loading,
}: TaskRowProps) {
  const classNames = [
    'ds-task-row',
    disabled ? 'ds-task-row--disabled' : null,
    loading ? 'ds-task-row--loading' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      data-density={density}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
    >
      <AtomicCheckbox
        label={title}
        description={description}
        checked={checked}
        disabled={disabled || loading}
        onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
      />
      <TaskMeta due={due} priority={priority} status={loading ? 'Syncing…' : undefined} />
      {trailing ? <div>{trailing}</div> : null}
    </div>
  );
}
