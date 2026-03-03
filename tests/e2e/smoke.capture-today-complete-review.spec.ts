import { expect, test } from "@playwright/test";
import { openRoute } from "../helpers/navigation";

test("planner smoke: capture -> today -> complete -> review", async ({ page }) => {
  const taskText = `ci-smoke-${Date.now()}`;

  await page.goto("/inbox", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toBeVisible();

  const captureInput = page.getByTestId("capture-input");
  await expect(captureInput).toBeEnabled({ timeout: 10000 });
  await captureInput.fill(taskText);
  await page.getByTestId("capture-submit").click();

  const inboxRow = page.locator(".row", { hasText: taskText }).first();
  await expect(inboxRow).toBeVisible();
  await inboxRow.getByTestId("task-move-today").click();

  await openRoute(page, "/today", ["Today"]);
  const todayRow = page.locator(".row", { hasText: taskText }).first();
  await expect(todayRow).toBeVisible();
  await todayRow.getByTestId("task-complete").click();

  await openRoute(page, "/review", ["Review"]);
  await expect(page.getByText(taskText).first()).toBeVisible();
});
