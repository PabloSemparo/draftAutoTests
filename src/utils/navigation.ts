import { expect, Page } from "@playwright/test";

export async function navigateToContracts(page: Page) {
  await page.goto("/contracts");
  await expect(page).toHaveURL("/contracts");
  await page.waitForLoadState("networkidle");
}
