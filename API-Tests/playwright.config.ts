import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Конфигурация Playwright для API-тестов
 * 
 * Использование:
 *   Запуск всех тестов: npx playwright test
 *   Запуск конкретного теста: npx playwright test tests/eq-debt-collection/packages/id/get/
 *   Запуск с UI: npx playwright test --ui
 *   Запуск с отладкой: npx playwright test --debug
 *   Генерация отчета: npx allure generate allure-results --clean -o allure-report
 */

// Загрузка переменных окружения
dotenv.config({ path: '../env_settings/.env.stage' });

export default defineConfig({
  // Базовая директория для тестов
  testDir: './API-Tests/tests',

  // Запуск тестов в параллельном режиме
  fullyParallel: true,

  // Количество повторов при неудаче
  retries: process.env.CI ? 2 : 0,

  // Количество рабочих процессов
  workers: process.env.CI ? 1 : undefined,

  // Фильтр для запуска только определенных тестов
  grep: process.env.TEST_GLOB || undefined,

  // Отчеты
  reporter: [
    ['allure-playwright', { outputFolder: '../test-results/allure-results' }],
    ['html', { outputFolder: '../test-results/html-report' }],
    ['json', { outputFile: '../test-results/results.json' }]
  ],

  // Конфигурация использования
  use: {
    // Базовый URL для API запросов
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Включить трассировку для первых неудачных тестов
    trace: 'on-first-retry',

    // Включить видео для первых неудачных тестов
    video: 'on-first-retry',

    // Время ожидания по умолчанию
    actionTimeout: 30000,

    // Время ожидания навигации
    navigationTimeout: 30000,

    // Аккуратное завершение
    exit: true,
  },

  // Конфигурация проектов (для разных окружений)
  projects: [
    {
      name: 'stage',
      use: {
        baseURL: process.env.STAGING_BASE_URL || process.env.BASE_URL,
      },
    },
    {
      name: 'production',
      use: {
        baseURL: process.env.PROD_BASE_URL,
      },
    },
  ],

  // Настройки веб-сервера для запуска перед тестами
  webServer: {
    command: 'npm run start:api',
    url: process.env.BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

  // Настройки экспорта типов
  outputDir: '../test-results/test-output',
});