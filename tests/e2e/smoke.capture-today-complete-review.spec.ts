import { expect, test } from "@playwright/test";
import { openRoute } from "../helpers/navigation";

test("planner smoke: settings persist + capture -> today -> complete -> review", async ({ page }) => {
  const taskText = `ci-smoke-${Date.now()}`;

  await openRoute(page, "/settings", ["Settings"]);
  await page.evaluate(() => {
    window.localStorage.setItem(
      "praxis-ui-preferences-v1",
      JSON.stringify({
        theme: "dark",
        density: "compact",
        reducedMotion: false
      })
    );
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");

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
