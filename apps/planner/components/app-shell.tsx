"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { CommandPalette } from "@/components/command-palette";
import { navItems } from "@/components/nav-items";
import { PlannerStoreProvider, usePlannerStore } from "@/lib/planner-store";

function SyncBadge() {
  const { syncLabel, replayNow } = usePlannerStore();
  return (
    <button type="button" className="chip-btn" onClick={() => void replayNow()} aria-live="polite">
      {syncLabel}
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPaletteOpen, setPaletteOpen] = useState(false);

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
              <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button type="button" className="ghost-btn" onClick={() => setPaletteOpen(true)}>
            Open Command Palette
            <span>Ctrl/Cmd + K</span>
          </button>
        </aside>

        <div className="surface">
          <header className="topbar">
            <div>
              <p className="eyebrow">Daily Execution</p>
              <h2>{activeLabel}</h2>
            </div>
            <div className="topbar-actions">
              <SyncBadge />
              <button type="button" className="chip-btn" onClick={() => setPaletteOpen(true)}>
                Command Palette
              </button>
            </div>
          </header>
          <main className="content">{children}</main>
        </div>

        <nav className="bottom-nav" aria-label="Planner sections mobile">
          {navItems.slice(0, 6).map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "bottom-link active" : "bottom-link"}>
              {item.shortLabel}
            </Link>
          ))}
        </nav>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onOpenChange={setPaletteOpen} />
    </PlannerStoreProvider>
  );
}
