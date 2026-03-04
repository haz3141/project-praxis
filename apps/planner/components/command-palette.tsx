"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/components/nav-items";

type CommandPaletteProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ isOpen, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const isPaletteShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isPaletteShortcut) {
        event.preventDefault();
        onOpenChange(!isOpen);
      }
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onOpenChange]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return navItems;
    }
    return navItems.filter((item) => item.label.toLowerCase().includes(normalized));
  }, [query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="palette-overlay" role="presentation" onClick={() => onOpenChange(false)}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
      >
        <label className="sr-only" htmlFor="command-palette-input">
          Search commands
        </label>
        <input
          id="command-palette-input"
          autoFocus
          className="palette-input"
          name="command-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search routes or actions (stub)"
          autoComplete="off"
        />
        <ul className="palette-list" aria-label="Available commands">
          {filteredItems.map((item) => (
            <li key={item.href}>
              <button
                className="palette-item"
                onClick={() => {
                  onOpenChange(false);
                  router.push(item.href);
                }}
                type="button"
              >
                <span>{item.label}</span>
                {pathname === item.href ? <span className="palette-chip">Current</span> : null}
              </button>
            </li>
          ))}
          {filteredItems.length === 0 ? (
            <li>
              <p className="palette-empty">No route matches your query yet.</p>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
