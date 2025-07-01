import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// ✅ Загружаем env-переменные из правильного файла
dotenv.config({ path: path.resolve(__dirname, "env_settings/.env.test2") });

export default defineConfig({
  testDir: "./API-Tests", // путь к тестам
  testMatch: ["**/*.spec.ts"], // можно уточнить шаблон тестов
  timeout: 1200000, // 20 минут на тест
  fullyParallel: true,

  // ✅ Отчёты
  reporter: [["line"], ["allure-playwright"]],

  use: {
    trace: "on-first-retry",
    baseURL: 'https://lc.test5.mmk.local',
    storageState: "tests/storageState.json",
  },
  // ✅ Запуск setup.ts один раз перед всеми тестами
  globalSetup:require.resolve("./tests/api-setup.ts"),
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
