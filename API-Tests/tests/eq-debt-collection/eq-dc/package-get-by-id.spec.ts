/**
 * Тесты для Package API - GET /v1/packages/{id}
 */

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { TEST_CONSTANTS, TEST_CONFIG, TEST_HEADERS } from './shared/types';
import { OpenApiTestUtils } from './shared/test-utils';

test.beforeAll(() => {
  console.log('🚀 Запуск тестовой серии: Package Get API');
});

test.afterAll(() => {
  console.log('✅ Тестовая серия завершена: Package Get API');
});

test.describe('GET /v1/packages/{id} - Получение пакета по ID', () => {
  const { VALID_PACKAGE_ID, BASE_URL } = TEST_CONSTANTS;
  const { STATUS_CODES, STATUS_TEXTS, RESPONSE_TIME } = TEST_CONFIG;

  test(`[200] Получение пакета по существующему ID: ${VALID_PACKAGE_ID}`, async ({ request }) => {
    let testSuccess = false;

    try {
      await OpenApiTestUtils.setupAllure(
        'EqvaCollection API',
        'Пакеты документов',
        'Получение пакета по ID',
        'critical',
        ['smoke', 'regression']
      );
      await OpenApiTestUtils.setupParentSuite('Package API', 'Get Package By ID');

      const response = await request.get(
        `${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}`,
        { headers: TEST_HEADERS.ACCEPT_JSON }
      );

      await OpenApiTestUtils.validateResponseTime(Date.now(), RESPONSE_TIME.VERY_FAST);
      OpenApiTestUtils.validateStatusCode(response.status(), STATUS_CODES.SUCCESS);
      OpenApiTestUtils.validateContentType(response.headers());

      const responseBody = await response.json();
      await OpenApiTestUtils.logAttachment('Response Body', responseBody);

      await OpenApiTestUtils.logStep('Проверка структуры пакета', () => {
        expect(responseBody, 'Ответ должен содержать id').toHaveProperty('id');
        expect(responseBody, 'Ответ должен содержать number').toHaveProperty('number');
        expect(responseBody, 'Ответ должен содержать typeId').toHaveProperty('typeId');
        expect(responseBody, 'Ответ должен содержать statusCode').toHaveProperty('statusCode');
        expect(responseBody, 'Ответ должен содержать createdAt').toHaveProperty('createdAt');
        expect(responseBody, 'Ответ должен содержать responsibleLawyerId').toHaveProperty('responsibleLawyerId');
        expect(responseBody, 'Ответ должен содержать includedContracts').toHaveProperty('includedContracts');

        expect(typeof responseBody.id, 'id должен быть строкой').toBe('string');
        expect(typeof responseBody.number, 'number должен быть числом').toBe('number');
        expect(Array.isArray(responseBody.includedContracts), 'includedContracts должен быть массивом').toBe(true);
      });

      testSuccess = true;
    } catch (error: any) {
      console.error('❌ Ошибка во время выполнения теста:', error);
      throw error;
    } finally {
      await OpenApiTestUtils.finalizeTest(
        testSuccess,
        `Пакет успешно получен по ID: ${VALID_PACKAGE_ID}`
      );
    }
  });

  test('[404] Пакет не найдено по несуществующему ID', async ({ request }) => {
    let testSuccess = false;
    const invalidId = '00000000-0000-0000-0000-000000000000';

    try {
      await OpenApiTestUtils.setupAllure(
        'EqvaCollection API',
        'Пакеты документов',
        'Обработка ошибок - Not Found',
        'normal',
        ['negative', 'regression']
      );

      const response = await request.get(
        `${BASE_URL}/api/v1/packages/${invalidId}`,
        { headers: TEST_HEADERS.ACCEPT_JSON }
      );

      await OpenApiTestUtils.validateExpectedStatusCodes(
        response.status(),
        [STATUS_CODES.NOT_FOUND, STATUS_CODES.SERVER_ERROR]
      );

      if (response.status() === STATUS_CODES.NOT_FOUND) {
        const responseBody = await response.json();
        await OpenApiTestUtils.logStep('Проверка структуры 404 ошибки', () => {
          expect(responseBody.status.code, 'Code должен быть NOT_FOUND').toBe(STATUS_TEXTS.NOT_FOUND);
        });
        await OpenApiTestUtils.logAttachment('404 Error Response', responseBody);
      }

      testSuccess = true;
    } catch (error: any) {
      console.error('❌ Ошибка во время выполнения теста:', error);
      throw error;
    } finally {
      await OpenApiTestUtils.finalizeTest(
        testSuccess,
        `Корректная обработка 404 для несуществующего ID: ${invalidId}`
      );
    }
  });
});