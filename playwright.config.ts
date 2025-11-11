import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// ✅ Загружаем env-переменные из правильного файла
dotenv.config({ path: path.resolve(__dirname, "env_settings/.env.stage") });
// Allure репортер

// Конфигурация окружения после загрузки .env
const env = {
  BASE_URL: process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru',
  STAGING_BASE_URL: process.env.STAGING_BASE_URL,
  PRODUCTION_BASE_URL: process.env.PRODUCTION_BASE_URL,
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: parseInt(process.env.SLOW_MO || '0'),
  ENV: process.env.NODE_ENV || 'development',
};

const environment = env.ENV;

const environmentConfigs = {
  development: {
    baseURL: env.BASE_URL,
    trace: 'on' as const,
    video: 'on' as const,
  },
  staging: {
    baseURL: env.STAGING_BASE_URL || env.BASE_URL,
    trace: 'on-first-retry' as const,
    video: 'on-first-retry' as const,
  },
  production: {
    baseURL: env.PRODUCTION_BASE_URL || env.BASE_URL,
    trace: 'retain-on-failure' as const,
    video: 'retain-on-failure' as const,
  },
};

const currentConfig = environmentConfigs[environment as keyof typeof environmentConfigs] || environmentConfigs.development;

// ✅ Единственный default export
export default defineConfig({
  testDir: './API-Tests',
  testMatch: ['**/*.spec.ts'],
  timeout: 1200000, // 20 минут на тест
  fullyParallel: true,

  // ✅ Отчёты
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false,
      environmentInfo: {
        OS: process.platform,
        NODE_VERSION: process.version,
        TEST_ENV: process.env.TEST_ENV || 'stage'
      }
    }]
  ],

  // ✅ Глобальная настройка
  globalSetup: require.resolve('./tests/api-setup.ts'),

  use: {
    ...currentConfig,
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    headless: env.HEADLESS,
    storageState: 'tests/storageState.json',
    launchOptions: {
      slowMo: env.SLOW_MO,
    },
  },

  // ✅ Конфигурация проектов
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
  ],
});