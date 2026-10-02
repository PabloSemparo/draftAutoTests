/**
 * Тесты для Package API - PATCH /v1/packages/{id}/status (обновление статуса)
 */

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { TEST_CONSTANTS, TEST_CONFIG, TEST_HEADERS } from './shared/types';
import { OpenApiTestUtils } from './shared/test-utils';

test.beforeAll(() => {
  console.log('🚀 Запуск тестовой серии: Package Status Update API');
});

test.afterAll(() => {
  console.log('✅ Тестовая серия завершена: Package Status Update API');
});

test.describe('PATCH /v1/packages/{id}/status - Обновление статуса пакета', () => {
  const { VALID_PACKAGE_ID, BASE_URL } = TEST_CONSTANTS;
  const { STATUS_CODES, RESPONSE_TIME } = TEST_CONFIG;

  test(`[200] Успешное обновление статуса пакета: ${VALID_PACKAGE_ID}`, async ({ request }) => {
    let testSuccess = false;

    try {
      await OpenApiTestUtils.setupAllure(
        'EqvaCollection API',
        'Пакеты документов',
        'Обновление статуса пакета',
        'normal',
        ['regression']
      );
      await OpenApiTestUtils.setupParentSuite('Package API', 'Update Package Status');

      const payload = {
        statusCode: 'ARCHIVED',
      };

      const response = await request.patch(
        `${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/status`,
        {
          headers: { ...TEST_HEADERS.ACCEPT_JSON, ...TEST_HEADERS.CONTENT_TYPE_JSON },
          data: payload,
        }
      );

      await OpenApiTestUtils.validateResponseTime(Date.now(), RESPONSE_TIME.FAST);
      OpenApiTestUtils.validateStatusCode(response.status(), STATUS_CODES.SUCCESS);
      OpenApiTestUtils.validateContentType(response.headers());

      const responseBody = await response.json();
      await OpenApiTestUtils.logAttachment('Response Body', responseBody);

      await OpenApiTestUtils.logStep('Проверка обновленного пакета', () => {
        expect(responseBody.statusCode, 'StatusCode должен быть ARCHIVED').toBe('ARCHIVED');
      });

      testSuccess = true;
    } catch (error: any) {
      console.error('❌ Ошибка во время выполнения теста:', error);
      throw error;
    } finally {
      await OpenApiTestUtils.finalizeTest(
        testSuccess,
        `Статус пакета успешно обновлен на ARCHIVED`
      );
    }
  });
});