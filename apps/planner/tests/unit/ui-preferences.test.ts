import { beforeEach, describe, expect, it } from "vitest";
import {
  applyUiPreferencesToDocument,
  parseUiPreferences,
  readUiPreferences,
  saveUiPreferences,
  UI_PREFERENCES_KEY
} from "@/lib/ui-preferences";

describe("ui preferences", () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        }
      }
    });
  });

  it("parses valid payload values", () => {
    const parsed = parseUiPreferences({
      theme: "dark",
      density: "compact",
      reducedMotion: true
    });

    expect(parsed).toEqual({
      theme: "dark",
      density: "compact",
      reducedMotion: true
    });
  });

  it("reads, writes, and applies preferences", () => {
    saveUiPreferences({
      theme: "light",
      density: "comfortable",
      reducedMotion: true
    });

    const stored = readUiPreferences();
    expect(stored.theme).toBe("light");
    expect(stored.density).toBe("comfortable");
    expect(stored.reducedMotion).toBe(true);

    applyUiPreferencesToDocument(stored);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-density")).toBe("comfortable");
    expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("true");

    expect(window.localStorage.getItem(UI_PREFERENCES_KEY)).toContain("light");
  });
});
