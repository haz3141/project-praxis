import { expect, type Page } from "@playwright/test";

async function clickByNameIfVisible(page: Page, role: "link" | "button", label: string): Promise<boolean> {
  const locator = page.getByRole(role, { name: new RegExp(label, "i") });
  const count = await locator.count();

  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    if (!(await candidate.isVisible().catch(() => false))) {
      continue;
    }

    await candidate.click();
    return true;
  }

  return false;
}

export async function openRoute(page: Page, route: string, labels: string[] = []): Promise<void> {
  for (const label of labels) {
    if (await clickByNameIfVisible(page, "link", label)) {
      await page.waitForLoadState("domcontentloaded");
      return;
    }
    if (await clickByNameIfVisible(page, "button", label)) {
      await page.waitForLoadState("domcontentloaded");
      return;
    }
  }

  await page.goto(route, { waitUntil: "domcontentloaded" });
}

export async function clickFirstVisible(page: Page, selectors: string[], timeoutMs = 5000): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      const visible = await locator.isVisible().catch(() => false);
      const enabled = await locator.isEnabled().catch(() => false);
      if (visible && enabled) {
        await locator.click();
        return;
      }
    }
    await page.waitForTimeout(100);
  }

  throw new Error(`No clickable selector became visible: ${selectors.join(", ")}`);
}

export async function fillFirstVisible(page: Page, selectors: string[], value: string, timeoutMs = 5000): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      const visible = await locator.isVisible().catch(() => false);
      const enabled = await locator.isEnabled().catch(() => false);
      if (visible && enabled) {
        await locator.fill(value);
        return;
      }
    }
    await page.waitForTimeout(100);
  }

  throw new Error(`No input selector became visible: ${selectors.join(", ")}`);
}

export async function expectTaskVisible(page: Page, taskText: string, timeoutMs = 10000): Promise<void> {
  await expect(page.getByText(taskText).first()).toBeVisible({ timeout: timeoutMs });
}
