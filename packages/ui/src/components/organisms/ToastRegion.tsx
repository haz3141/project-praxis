import type { ReactNode } from 'react';

export interface ToastRegionProps {
  children: ReactNode;
}

export function ToastRegion({ children }: ToastRegionProps) {
  return <div className="ds-toast-region">{children}</div>;
}
