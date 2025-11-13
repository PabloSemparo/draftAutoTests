// tests/global-setup.ts
import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🌐 Глобальная настройка тестовой среды');
  console.log(`📍 Base URL: ${process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru'}`);
  console.log(`🧪 Количество тестовых проектов: ${config.projects.length}`);

  // Инициализация глобальных переменных или подготовка данных
  process.env.TEST_START_TIME = new Date().toISOString();

  console.log('🚀 Тестовая среда готова к запуску');
}

export default globalSetup;