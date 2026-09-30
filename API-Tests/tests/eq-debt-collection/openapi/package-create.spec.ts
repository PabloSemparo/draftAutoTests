/**
 * Тесты для Package API - POST /v1/packages (создание)
 */

import { test, expect } from '@playwright/test';
import {
  TEST_CONSTANTS,
  TEST_CONFIG,
  TEST_HEADERS,
} from './shared/types';
import { OpenApiTestUtils } from './shared/test-utils';

test.beforeAll(() => {
  console.log('🚀 Запуск тестовой серии: Package Create API');
});

test.afterAll(() => {
  console.log('✅ Тестовая серия завершена: Package Create API');
});

test.describe('POST /v1/packages - Создание пакета', () => {
  const {
    BASE_URL,
    VALID_COURT_LAWYER_ID,
    VALID_PACKAGE_TYPE_ID,
    VALID_CONTRACT_ID,
    VALID_CONTRACT_COURT_LAWYER_ID,
  } = TEST_CONSTANTS;

const {
    STATUS_CODES,
    STATUS_TEXTS,
    RESPONSE_TIME,
  } = TEST_CONFIG;

/**
 * Позитивный сценарий:
 * Успешное создание пакета
 */
test('[201] Успешное создание пакета', async ({ request }) => {
  let testSuccess = false;

  try {
    await OpenApiTestUtils.setupAllure(
      'EqvaCollection API',
      'Пакеты документов',
      'Создание пакета',
      'normal',
      ['regression']
    );

    await OpenApiTestUtils.setupParentSuite(
      'Package API',
      'Create Package'
    );

    const payload = {
      courtLawyerId: VALID_COURT_LAWYER_ID,
      packageTypeId: VALID_PACKAGE_TYPE_ID,
      contracts: [
        {
          id: VALID_CONTRACT_ID,
          courtLawyerId: VALID_CONTRACT_COURT_LAWYER_ID,
        },
      ],
    };

    await OpenApiTestUtils.logAttachment(
      'Request Payload',
      payload
    );

    const startTime = Date.now();

    const response = await request.post(
      `${BASE_URL}/v1/packages`,
      {
        headers: {
          ...TEST_HEADERS.ACCEPT_JSON,
          ...TEST_HEADERS.CONTENT_TYPE_JSON,
        },
        data: payload,
      }
    );

    await OpenApiTestUtils.validateResponseTime(
      startTime,
      RESPONSE_TIME.FAST
    );

    await OpenApiTestUtils.validateExpectedStatusCodes(
      response.status(),
      [STATUS_CODES.CREATED]
    );

    const responseBody = await response.json();

    await OpenApiTestUtils.logAttachment(
      'Response Body',
      responseBody
    );

    await OpenApiTestUtils.logStep(
      'Проверка ответа созданного пакета',
      () => {
        expect(
          responseBody,
          'Ответ должен содержать id'
        ).toHaveProperty('id');

        expect(
          responseBody.id,
          'id должен быть строкой'
        ).toEqual(expect.any(String));
      }
    );

    testSuccess = true;
  } catch (error) {
    console.error(
      '❌ Ошибка при создании пакета:',
      error
    );

    throw error;
  } finally {
    await OpenApiTestUtils.finalizeTest(
      testSuccess,
      'Пакет успешно создан'
    );
  }
});

/**
   * Негативный сценарий:
   * Отсутствует обязательное поле courtLawyerId
   */
  test(
    '[400] Ошибка валидации при отсутствии courtLawyerId',
    async ({ request }) => {
      let testSuccess = false;

try {
        await OpenApiTestUtils.setupAllure(
          'EqvaCollection API',
          'Пакеты документов',
          'Валидация - Отсутствие courtLawyerId',
          'critical',
          ['negative', 'validation']
        );

await OpenApiTestUtils.setupParentSuite(
          'Package API',
          'Create Package - Validation'
        );

const payload = {
          packageTypeId: VALID_PACKAGE_TYPE_ID,
          contracts: [
            {
              id: VALID_CONTRACT_ID,
              courtLawyerId: VALID_CONTRACT_COURT_LAWYER_ID,
            },
          ],
        };

await OpenApiTestUtils.logAttachment(
          'Request Payload',
          payload
        );

const startTime = Date.now();

const response = await request.post(
          `${BASE_URL}/v1/packages`,
          {
            headers: {
              ...TEST_HEADERS.ACCEPT_JSON,
              ...TEST_HEADERS.CONTENT_TYPE_JSON,
            },
            data: payload,
          }
        );

await OpenApiTestUtils.validateResponseTime(
          startTime,
          RESPONSE_TIME.FAST
        );

await OpenApiTestUtils.validateExpectedStatusCodes(
          response.status(),
          [
            STATUS_CODES.BAD_REQUEST,
            STATUS_CODES.VALIDATION_ERROR,
          ]
        );

const responseBody = await response.json();

await OpenApiTestUtils.logAttachment(
          'Validation Error Response',
          responseBody
        );

await OpenApiTestUtils.logStep(
          'Проверка структуры ошибки валидации',
          () => {
            expect(
              responseBody,
              'Ответ об ошибке должен быть определен'
            ).toBeDefined();

if (responseBody.status) {
              expect(
                responseBody.status,
                'Ответ должен содержать status'
              ).toBeDefined();

if (responseBody.status.code) {
                expect(
                  responseBody.status.code,
                  'Code ошибки должен быть VALIDATION_ERROR'
                ).toBe(STATUS_TEXTS.BAD_REQUEST);
              }
            }
          }
        );

testSuccess = true;
      } catch (error) {
        console.error(
          '❌ Ошибка во время выполнения негативного теста:',
          error
        );

throw error;
      } finally {
        await OpenApiTestUtils.finalizeTest(
          testSuccess,
          'Корректная обработка ошибки валидации при отсутствии courtLawyerId'
        );
      }
    }
  );

/**
   * Негативный сценарий:
   * Отсутствует обязательное поле packageTypeId
   */
  test(
    '[400] Ошибка валидации при отсутствии packageTypeId',
    async ({ request }) => {
      let testSuccess = false;

try {
        await OpenApiTestUtils.setupAllure(
          'EqvaCollection API',
          'Пакеты документов',
          'Валидация - Отсутствие packageTypeId',
          'critical',
          ['negative', 'validation']
        );

await OpenApiTestUtils.setupParentSuite(
          'Package API',
          'Create Package - Validation'
        );

const payload = {
          courtLawyerId: VALID_COURT_LAWYER_ID,
          contracts: [
            {
              id: VALID_CONTRACT_ID,
              courtLawyerId: VALID_CONTRACT_COURT_LAWYER_ID,
            },
          ],
        };

await OpenApiTestUtils.logAttachment(
          'Request Payload',
          payload
        );

const startTime = Date.now();

const response = await request.post(
          `${BASE_URL}/v1/packages`,
          {
            headers: {
              ...TEST_HEADERS.ACCEPT_JSON,
              ...TEST_HEADERS.CONTENT_TYPE_JSON,
            },
            data: payload,
          }
        );

await OpenApiTestUtils.validateResponseTime(
          startTime,
          RESPONSE_TIME.FAST
        );

await OpenApiTestUtils.validateExpectedStatusCodes(
          response.status(),
          [
            STATUS_CODES.BAD_REQUEST,
            STATUS_CODES.VALIDATION_ERROR,
          ]
        );

const responseBody = await response.json();

await OpenApiTestUtils.logAttachment(
          'Validation Error Response',
          responseBody
        );

testSuccess = true;
      } catch (error) {
        console.error(
          '❌ Ошибка во время выполнения негативного теста:',
          error
        );

throw error;
      } finally {
        await OpenApiTestUtils.finalizeTest(
          testSuccess,
          'Корректная обработка ошибки валидации при отсутствии packageTypeId'
        );
      }
    }
  );

/**
   * Негативный сценарий:
   * Отсутствует обязательное поле contracts
   */
  test(
    '[400] Ошибка валидации при отсутствии contracts',
    async ({ request }) => {
      let testSuccess = false;

try {
        await OpenApiTestUtils.setupAllure(
          'EqvaCollection API',
          'Пакеты документов',
          'Валидация - Отсутствие contracts',
          'critical',
          ['negative', 'validation']
        );

await OpenApiTestUtils.setupParentSuite(
          'Package API',
          'Create Package - Validation'
        );

const payload = {
          courtLawyerId: VALID_COURT_LAWYER_ID,
          packageTypeId: VALID_PACKAGE_TYPE_ID,
        };

await OpenApiTestUtils.logAttachment(
          'Request Payload',
          payload
        );

const startTime = Date.now();

const response = await request.post(
          `${BASE_URL}/v1/packages`,
          {
            headers: {
              ...TEST_HEADERS.ACCEPT_JSON,
              ...TEST_HEADERS.CONTENT_TYPE_JSON,
            },
            data: payload,
          }
        );

await OpenApiTestUtils.validateResponseTime(
          startTime,
          RESPONSE_TIME.FAST
        );

await OpenApiTestUtils.validateExpectedStatusCodes(
          response.status(),
          [
            STATUS_CODES.BAD_REQUEST,
            STATUS_CODES.VALIDATION_ERROR,
          ]
        );

const responseBody = await response.json();

await OpenApiTestUtils.logAttachment(
          'Validation Error Response',
          responseBody
        );

testSuccess = true;
      } catch (error) {
        console.error(
          '❌ Ошибка во время выполнения негативного теста:',
          error
        );

throw error;
      } finally {
        await OpenApiTestUtils.finalizeTest(
          testSuccess,
          'Корректная обработка ошибки валидации при отсутствии contracts'
        );
      }
    }
  );
});
