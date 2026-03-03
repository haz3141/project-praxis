import type { ReactNode } from 'react';

export interface AppShellProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  main: ReactNode;
  utility?: ReactNode;
}

export function AtomicAppShell({ sidebar, topbar, main, utility }: AppShellProps) {
  return (
    <div className="ds-app-shell">
      <aside className="ds-app-shell-sidebar">{sidebar}</aside>
      <div className="ds-app-shell-main-wrap">
        <header className="ds-app-shell-topbar">{topbar}</header>
        <main className="ds-app-shell-main">{main}</main>
      </div>
      <aside className="ds-app-shell-utility">{utility}</aside>
    </div>
  );
}
