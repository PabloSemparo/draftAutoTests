/**
 * Тесты для Package API - GET /v1/packages (список)
 */

import { test, expect } from '@playwright/test';
import {
  TEST_CONSTANTS,
  TEST_CONFIG,
  TEST_HEADERS,
} from './shared/types';
import { OpenApiTestUtils } from './shared/test-utils';

test.beforeAll(() => {
  console.log('🚀 Запуск тестовой серии: Package List API');
});

test.afterAll(() => {
  console.log('✅ Тестовая серия завершена: Package List API');
});

test.describe('GET /v1/packages - Список пакетов', () => {
  const { BASE_URL } = TEST_CONSTANTS;
  const { STATUS_CODES, RESPONSE_TIME } = TEST_CONFIG;

  test('[200] Успешное получение списка пакетов', async ({ request }) => {
    let testSuccess = false;

    try {
      await OpenApiTestUtils.setupAllure(
        'EqvaCollection API',
        'Пакеты документов',
        'Получение списка пакетов',
        'normal',
        ['smoke', 'regression']
      );

      await OpenApiTestUtils.setupParentSuite(
        'Package API',
        'Get Packages List'
      );

      const startTime = Date.now();

      const response = await request.get(
        `${BASE_URL}/v1/packages`,
        {
          headers: TEST_HEADERS.ACCEPT_JSON,
        }
      );

      await OpenApiTestUtils.validateResponseTime(
        startTime,
        RESPONSE_TIME.FAST
      );

      OpenApiTestUtils.validateStatusCode(
        response.status(),
        STATUS_CODES.SUCCESS
      );

      OpenApiTestUtils.validateContentType(
        response.headers()
      );

      const responseBody = await response.json();

      await OpenApiTestUtils.logAttachment(
        'Response Body',
        responseBody
      );

      await OpenApiTestUtils.logStep(
        'Проверка структуры списка пакетов',
        () => {
          // Корневые поля
          expect(
            responseBody,
            'Ответ должен содержать hasMore'
          ).toHaveProperty('hasMore');

          expect(
            responseBody,
            'Ответ должен содержать items'
          ).toHaveProperty('items');

          expect(
            responseBody,
            'Ответ должен содержать pageNumber'
          ).toHaveProperty('pageNumber');

          expect(
            responseBody,
            'Ответ должен содержать pageSize'
          ).toHaveProperty('pageSize');

          expect(
            responseBody,
            'Ответ должен содержать totalItems'
          ).toHaveProperty('totalItems');

          // Типы корневых полей
          expect(
            typeof responseBody.hasMore,
            'hasMore должен быть boolean'
          ).toBe('boolean');

          expect(
            Array.isArray(responseBody.items),
            'items должен быть массивом'
          ).toBe(true);

          expect(
            typeof responseBody.pageNumber,
            'pageNumber должен быть числом'
          ).toBe('number');

          expect(
            typeof responseBody.pageSize,
            'pageSize должен быть числом'
          ).toBe('number');

          expect(
            typeof responseBody.totalItems,
            'totalItems должен быть числом'
          ).toBe('number');

          // Проверяем элементы списка,
          // только если список не пустой
          if (responseBody.items.length > 0) {
            const firstItem = responseBody.items[0];

            expect(
              firstItem,
              'Элемент списка должен содержать id'
            ).toHaveProperty('id');

            expect(
              firstItem,
              'Элемент списка должен содержать createdAt'
            ).toHaveProperty('createdAt');

            expect(
              firstItem,
              'Элемент списка должен содержать number'
            ).toHaveProperty('number');

            expect(
              firstItem,
              'Элемент списка должен содержать includedContracts'
            ).toHaveProperty('includedContracts');

            expect(
              firstItem,
              'Элемент списка должен содержать responsibleLawyerId'
            ).toHaveProperty('responsibleLawyerId');

            expect(
              firstItem,
              'Элемент списка должен содержать statusCode'
            ).toHaveProperty('statusCode');

            expect(
              firstItem,
              'Элемент списка должен содержать typeId'
            ).toHaveProperty('typeId');

            expect(
              typeof firstItem.id,
              'id должен быть строкой'
            ).toBe('string');

            expect(
              typeof firstItem.createdAt,
              'createdAt должен быть строкой'
            ).toBe('string');

            expect(
              typeof firstItem.number,
              'number должен быть числом'
            ).toBe('number');

            expect(
              Array.isArray(firstItem.includedContracts),
              'includedContracts должен быть массивом'
            ).toBe(true);

            expect(
              typeof firstItem.responsibleLawyerId,
              'responsibleLawyerId должен быть строкой'
            ).toBe('string');

            expect(
              typeof firstItem.statusCode,
              'statusCode должен быть строкой'
            ).toBe('string');

            expect(
              typeof firstItem.typeId,
              'typeId должен быть строкой'
            ).toBe('string');
          }
        }
      );

      testSuccess = true;
    } catch (error) {
      console.error(
        '❌ Ошибка во время выполнения теста:',
        error
      );

      throw error;
    } finally {
      await OpenApiTestUtils.finalizeTest(
        testSuccess,
        'Список пакетов успешно получен'
      );
    }
  });
});