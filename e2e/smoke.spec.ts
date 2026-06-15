import { test, expect } from "@playwright/test";

test("homepage loads with correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/GTA Threads/);
});

test("can navigate to shop", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Shop" }).first().click();
  await expect(page).toHaveURL(/\/shop/);
  await expect(page.getByRole("heading", { name: /Shop/i })).toBeVisible();
});

test("can navigate to custom orders wizard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Custom" }).first().click();
  await expect(page).toHaveURL(/\/custom-orders/);
});

test("login page has form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("product page shows for a real product", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("link").filter({ has: page.locator("h3") }).first().click();
  await expect(page.getByRole("button", { name: /Add to bag/i })).toBeVisible();
});
