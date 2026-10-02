/**
 * Тесты для Facsimile API - GET /v1/facsimiles (список)
 */

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { TEST_CONSTANTS, TEST_CONFIG, TEST_HEADERS } from './shared/types';
import { OpenApiTestUtils } from './shared/test-utils';

test.beforeAll(() => {
  console.log('🚀 Запуск тестовой серии: Facsimile List API');
});

test.afterAll(() => {
  console.log('✅ Тестовая серия завершена: Facsimile List API');
});

test.describe('GET /v1/facsimiles - Список факсимиле', () => {
  const { BASE_URL } = TEST_CONSTANTS;
  const { STATUS_CODES, RESPONSE_TIME } = TEST_CONFIG;

  test('[200] Успешное получение списка факсимиле', async ({ request }) => {
    let testSuccess = false;

    try {
      await OpenApiTestUtils.setupAllure(
        'EqvaCollection API',
        'Факсимиле сотрудников',
        'Получение списка факсимиле',
        'normal',
        ['smoke', 'regression']
      );
      await OpenApiTestUtils.setupParentSuite('Facsimile API', 'Get Facsimiles List');

      const response = await request.get(`${BASE_URL}/v1/facsimiles`, {
        headers: TEST_HEADERS.ACCEPT_JSON,
      });

      const responseTime = await OpenApiTestUtils.validateResponseTime(
        Date.now(),
        RESPONSE_TIME.FAST
      );

      await OpenApiTestUtils.logStep('Проверка статус кода 200', () => {
        OpenApiTestUtils.validateStatusCode(response.status(), STATUS_CODES.SUCCESS);
      });

      await OpenApiTestUtils.logStep('Проверка Content-Type', () => {
        OpenApiTestUtils.validateContentType(response.headers());
      });

      const responseBody = await response.json();
      await OpenApiTestUtils.logAttachment('Response Body', responseBody);

      await OpenApiTestUtils.logStep('Проверка структуры списка', () => {
        expect(responseBody, 'Ответ должен содержать data').toHaveProperty('data');
        expect(responseBody, 'Ответ должен содержать meta').toHaveProperty('meta');

        const data = responseBody.data;
        const meta = responseBody.meta;

        expect(Array.isArray(data), 'data должен быть массивом').toBe(true);
        expect(meta, 'meta должен содержать totalCount').toHaveProperty('totalCount');
        expect(meta, 'meta должен содержать pageSize').toHaveProperty('pageSize');
      });

      testSuccess = true;
    } catch (error: any) {
      console.error('❌ Ошибка во время выполнения теста:', error);
      throw error;
    } finally {
      await OpenApiTestUtils.finalizeTest(
        testSuccess,
        'Список факсимиле успешно получен'
      );
    }
  });
});