import { chromium } from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { users } from "../src/fixtures/users";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "env_settings/.env.stage" });

export default async function globalSetup() {
  console.log("🔹 Глобальная настройка: Авторизация перед тестами...");

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  console.log("🔹 Переход на страницу авторизации...");
  await page.goto(`${process.env.AUTH_URL}`, { timeout: 60000 });
  await page.waitForLoadState("networkidle");

  console.log("🔹 Вход в систему...");
  await loginPage.login(users.testUser.username, users.testUser.password);
  console.log("✅ Авторизация успешна!");

  const storagePath = "tests/storageState.json";
  if (!fs.existsSync("tests")) {
    fs.mkdirSync("tests");
  }

  await context.storageState({ path: storagePath });

  console.log(`✅ Сессия сохранена в ${storagePath}`);
  await browser.close();
}
