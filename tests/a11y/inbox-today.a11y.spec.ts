import { expect, test, type Page } from "@playwright/test";
import { formatViolations, runAxe } from "../helpers/axe";
import { openRoute } from "../helpers/navigation";

const routes: Array<{ path: string; labels: string[] }> = [
  { path: "/inbox", labels: ["Inbox"] },
  { path: "/today", labels: ["Today"] },
  { path: "/settings", labels: ["Settings"] }
];

async function readActiveElement(page: Page) {
  return page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active) return null;
    const rect = active.getBoundingClientRect();
    return {
      tag: active.tagName.toLowerCase(),
      id: active.id,
      role: active.getAttribute("role"),
      href: active instanceof HTMLAnchorElement ? active.getAttribute("href") : null,
      text: active.textContent?.trim() ?? "",
      visible: rect.width > 0 && rect.height > 0
    };
  });
}

for (const route of routes) {
  test(`axe scan has no serious violations: ${route.path}`, async ({ page }) => {
    await openRoute(page, route.path, route.labels);
    const violations = await runAxe(page, ["critical", "serious"]);
    expect(violations, formatViolations(violations)).toEqual([]);
  });

  test(`keyboard focus is reachable and advances: ${route.path}`, async ({ page }) => {
    await openRoute(page, route.path, route.labels);
    await page.keyboard.press("Tab");

    const first = await readActiveElement(page);
    expect(first).not.toBeNull();
    expect(first?.tag).not.toBe("body");
    expect(first?.visible).toBe(true);

    const focusTrail = new Set<string>();
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press("Tab");
      const current = await readActiveElement(page);
      expect(current).not.toBeNull();
      expect(current?.tag).not.toBe("body");
      focusTrail.add(`${current?.tag}:${current?.id ?? ""}:${current?.role ?? ""}:${current?.href ?? ""}:${current?.text ?? ""}`);
    }

    expect(focusTrail.size).toBeGreaterThan(1);
  });
}
