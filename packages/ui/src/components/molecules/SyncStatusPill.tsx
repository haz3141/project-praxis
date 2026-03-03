import type { HTMLAttributes } from 'react';
import { AtomicStatusDot } from '../atoms/StatusDot';
import type { AtomicStatusDotTone } from '../atoms/StatusDot';

export type SyncStatusPillState = 'offline' | 'syncing' | 'synced' | 'conflict';

export interface SyncStatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  state: SyncStatusPillState;
  density?: 'comfortable' | 'compact';
  live?: 'off' | 'polite' | 'assertive';
}

const STATUS_COPY: Record<SyncStatusPillState, string> = {
  offline: 'Offline',
  syncing: 'Syncing...',
  synced: 'Synced',
  conflict: 'Sync conflict',
};

const STATUS_TONE: Record<SyncStatusPillState, AtomicStatusDotTone> = {
  offline: 'warning',
  syncing: 'sync',
  synced: 'success',
  conflict: 'error',
};

export function SyncStatusPill({
  state,
  density = 'comfortable',
  live = 'polite',
  className,
  children,
  ...props
}: SyncStatusPillProps) {
  const classes = ['ds-sync-status-pill', `ds-sync-status-pill--${state}`, className].filter(Boolean).join(' ');
  const statusText = children ?? STATUS_COPY[state];
  const ariaLive = live === 'off' ? undefined : live;

  return (
    <span className={classes} data-density={density} role={ariaLive ? 'status' : undefined} aria-live={ariaLive} {...props}>
      <AtomicStatusDot tone={STATUS_TONE[state]} size="sm" />
      <span className="ds-sync-status-pill-text">{statusText}</span>
    </span>
  );
}
