"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AtomicButton, SyncStatusPill, type SyncStatusPillState } from "@praxis/ui";
import { CommandPalette } from "@/components/command-palette";
import { navItems } from "@/components/nav-items";
import { PlannerStoreProvider, usePlannerStore } from "@/lib/planner-store";

function SyncControls() {
  const { syncLabel, syncState, replayNow } = usePlannerStore();
  const state = useMemo<SyncStatusPillState>(() => {
    if (syncState.phase === "offline") return "offline";
    if (syncState.phase === "syncing") return "syncing";
    if (syncState.phase === "error") return "conflict";
    return "synced";
  }, [syncState.phase]);

  return (
    <>
      <SyncStatusPill state={state} density="compact">
        {syncLabel}
      </SyncStatusPill>
      <AtomicButton type="button" variant="secondary" density="compact" onClick={() => void replayNow()}>
        Sync now
      </AtomicButton>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const mobileItems = useMemo(() => navItems.filter((item) => item.href !== "/studio"), []);

  const activeLabel = useMemo(() => {
    const found = navItems.find((item) => item.href === pathname);
    return found?.label ?? "Planner";
  }, [pathname]);

  return (
    <PlannerStoreProvider>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand-block">
            <p className="brand-kicker">Project Praxis</p>
            <h1>Planner</h1>
          </div>
          <nav aria-label="Planner sections" className="side-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "nav-link active" : "nav-link"}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <AtomicButton type="button" variant="ghost" onClick={() => setPaletteOpen(true)}>
            Open Command Palette
          </AtomicButton>
          <p className="muted">Ctrl/Cmd + K</p>
        </aside>

        <div className="surface">
          <header className="topbar">
            <div>
              <p className="eyebrow">Daily Execution</p>
              <h2>{activeLabel}</h2>
            </div>
            <div className="topbar-actions">
              <SyncControls />
              <AtomicButton type="button" variant="ghost" density="compact" onClick={() => setPaletteOpen(true)}>
                Command Palette
              </AtomicButton>
            </div>
          </header>
          <main className="content">{children}</main>
        </div>

        <nav className="bottom-nav" aria-label="Planner sections mobile">
          {mobileItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "bottom-link active" : "bottom-link"}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.shortLabel}
            </Link>
          ))}
        </nav>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onOpenChange={setPaletteOpen} />
    </PlannerStoreProvider>
  );
}
