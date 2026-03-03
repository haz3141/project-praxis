import type { ReactNode } from 'react';

export interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onSelect,
  disabled,
  className,
}: ListRowProps) {
  const classes = ['ds-list-row', onSelect ? 'ds-list-row--button' : '', className].filter(Boolean).join(' ');

  const content = (
    <>
      <div>{leading}</div>
      <div className="ds-list-row-main">
        <p className="ds-list-row-title">{title}</p>
        {subtitle ? <p className="ds-list-row-subtitle">{subtitle}</p> : null}
      </div>
      <div>{trailing}</div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" className={classes} onClick={onSelect} disabled={disabled}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
