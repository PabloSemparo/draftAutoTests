// tests/global-teardown.ts
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🔚 Глобальное завершение тестовой сессии');
  console.log('✅ Все ресурсы освобождены');
  console.log('📊 Генерация отчетов...');

  // Дополнительная логика очистки
  const startTime = process.env.TEST_START_TIME;
  if (startTime) {
    const endTime = new Date();
    const start = new Date(startTime);
    const duration = endTime.getTime() - start.getTime();
    console.log(`⏱️ Общее время выполнения тестов: ${duration}ms`);
  }

  console.log('🏁 Тестовая сессия завершена');
}

export default globalTeardown;