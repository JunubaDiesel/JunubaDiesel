import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("buscar hub loads", async ({ page }) => {
    await page.goto("/buscar");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("parts catalog loads", async ({ page }) => {
    await page.goto("/parts");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("recursos loads", async ({ page }) => {
    await page.goto("/recursos");
    await expect(page.getByRole("heading", { name: "Guías y recursos" }).first()).toBeVisible();
  });
});
