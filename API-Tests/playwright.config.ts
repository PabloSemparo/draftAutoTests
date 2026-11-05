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
 * 
 * Для тестов с HTTPS (lc.preprod.mmk.local:8080) используется SSL renegotiation.
 * Если возникает ошибка "unsafe legacy renegotiation disabled", запустите с:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx playwright test
 * 
 * Подробности см. в API-Tests/SSL-FIX.md
 */

// Загрузка переменных окружения
// Сначала загружаем глобальные настройки
dotenv.config({ path: '../env_settings/.env.stage' });

// Затем загружаем локальные настройки (перезаписывают глобальные)
dotenv.config({ path: './API-Tests/.env.local', override: true });

// Установка переменной окружения для игнорирования ошибок SSL
// Это необходимо для работы с серверами, требующими legacy renegotiation
// Устанавливаем переменную окружения перед любыми другими операциями
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.log('⚠️  Установлена переменная NODE_TLS_REJECT_UNAUTHORIZED=0 для игнорирования ошибок SSL');
}

export default defineConfig({
  // Базовая директория для тестов
  testDir: '.',

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

    // Игнорировать ошибки HTTPS для API тестов (解决 SSL renegotiation ошибка)
    // Устанавливаем флаг для игнорирования ошибок SSL на уровне контекста
    ignoreHTTPSErrors: true,
  },

  // Настройки контекста для API запросов
  contextOptions: {
    // Игнорирование ошибок SSL для APIRequestContext
    // Это эквивалентно установке NODE_TLS_REJECT_UNAUTHORIZED=0
    ignoreHTTPSErrors: true,
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

  // Настройки экспорта типов
  outputDir: '../test-results/test-output',
});