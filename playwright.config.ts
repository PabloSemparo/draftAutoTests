import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// ✅ Загружаем env-переменные из правильного файла
dotenv.config({ path: path.resolve(__dirname, "env_settings/.env.test5") });

export default defineConfig({
  testDir: "./API-Tests", // путь к тестам
  testMatch: ["**/*.spec.ts"], // можно уточнить шаблон тестов
  timeout: 1200000, // 20 минут на тест
  fullyParallel: true,

  // ✅ Отчёты
  reporter: [["list"], ["html", { open: "never" }], ["allure-playwright"]],

  use: {
    baseURL: process.env.BASE_URL, // ✅ Подставляем из .env
    storageState: "tests/storageState.json", // ✅ Используем авторизованную сессию
    navigationTimeout: 60000,
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    headless: true,
  },

  // ✅ Запуск setup.ts один раз перед всеми тестами

  // ✅ Конфигурация браузеров
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
