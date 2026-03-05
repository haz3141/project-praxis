import { expect, test } from "@playwright/test";
import { openRoute } from "../helpers/navigation";

test("planner smoke: settings persist + capture -> today -> complete -> review", async ({ page }) => {
  const taskText = `ci-smoke-${Date.now()}`;

  await openRoute(page, "/settings", ["Settings"]);
  await expect(page.locator("#settings-theme")).toBeEnabled();
  await expect(page.locator("#settings-density")).toBeEnabled();
  await page.locator("#settings-theme").selectOption("dark");
  await page.locator("#settings-density").selectOption("compact");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("#settings-theme")).toHaveValue("dark");
  await expect(page.locator("#settings-density")).toHaveValue("compact");

  await page.goto("/inbox", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toBeVisible();

  const captureInput = page.getByTestId("capture-input");
  await expect(captureInput).toBeEnabled({ timeout: 10000 });
  await captureInput.fill(taskText);
  await page.getByTestId("capture-submit").click();

  await expect(page.getByText(taskText).first()).toBeVisible();
  await page.getByTestId("task-move-today").first().click();

  await openRoute(page, "/today", ["Today"]);
  await expect(page.getByText(taskText).first()).toBeVisible();
  await page.getByTestId("task-complete").first().click();

  await openRoute(page, "/review", ["Review"]);
  await expect(page.getByText(taskText).first()).toBeVisible();
});
