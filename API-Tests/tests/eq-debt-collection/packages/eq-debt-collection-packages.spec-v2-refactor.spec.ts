import { test, expect } from '@playwright/test';
import { epic, feature, owner, tag, story, severity, description, step, attachment } from 'allure-js-commons';

// Константы и конфигурация
const BASE_CONFIG = {
    baseURL: 'https://eq-debt-collection-stage.bdengi.ru',
    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }
};

// Тестовые данные
const TEST_CASES = {
    success: [
        {
            name: 'Тестовый_NEED_FOR_GAS_IS_FALSE (DISTRICT) Суд указан',
            packageTypeId: 'a1c067b4-9f2a-400b-a280-c15d48957785',
            contractIds: ['127ee508-8acb-4993-82be-e01869241c64'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета DISTRICT с указанным судом'
        },
        {
            name: 'Тестовый_NEED_FOR_GAS_IS_FALSE (DISTRICT) Дефолтный',
            packageTypeId: 'a1c067b4-9f2a-400b-a280-c15d48957785',
            contractIds: ['000090ee-c2f9-41d7-a223-e6a97b95768c'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета DISTRICT с дефолтным судом'
        },
        {
            name: 'Тестовый_NEED_FOR_GAS_IS_FALSE (MAGISTRATE) Суд указан',
            packageTypeId: '893592f1-e26a-4d96-a230-66767c26e77a',
            contractIds: ['00004a4d-358e-46e5-8ac5-33a4956f33b0'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета MAGISTRATE с указанным судом'
        },
        {
            name: 'Тестовый_NEED_FOR_GAS_IS_FALSE (MAGISTRATE) Дефолтный',
            packageTypeId: '893592f1-e26a-4d96-a230-66767c26e77a',
            contractIds: ['000090ee-c2f9-41d7-a223-e6a97b95768c'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета MAGISTRATE с дефолтным судом'
        },
        {
            name: 'Районный суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE Суд указан',
            packageTypeId: '7be90c4b-487a-4366-9af4-35c1d8f7c937',
            contractIds: ['5077f0d5-dc9d-48bb-bcfa-f579ccf78c35'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета районного суда ФЭ с указанным судом'
        },
        {
            name: 'Районный суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE Дефолтный',
            packageTypeId: '7be90c4b-487a-4366-9af4-35c1d8f7c937',
            contractIds: ['127ee508-8acb-4993-82be-e01869241c64'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета районного суда ФЭ с дефолтным судом'
        },
        {
            name: 'Мировой суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE Суд указан',
            packageTypeId: 'a7d7af33-a42d-4a66-bb8a-40eb9c1bd21c',
            contractIds: ['00004a4d-358e-46e5-8ac5-33a4956f33b0'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета мирового суда ФЭ с указанным судом'
        },
        {
            name: 'Мировой суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE Дефолтный',
            packageTypeId: 'a7d7af33-a42d-4a66-bb8a-40eb9c1bd21c',
            contractIds: ['0000cf37-d804-4fe7-a725-58fa4567bfb4'],
            expectedStatus: 201,
            maxResponseTime: 5000,
            severity: 'critical',
            story: 'Создание пакета мирового суда ФЭ с дефолтным судом'
        }
    ],
    error: [
        {
            name: 'Не найдены контракты',
            packageTypeId: '893592f1-e26a-4d96-a230-66767c26e77a',
            contractIds: [
                '06246991-37b4-42e9-8869-ee8265f6bdd5',
                'b5b0256a-f654-4fd1-bb3d-b2e84a8611d2',
                '0f607876-11db-48fc-ad7a-fa54e62dbc3b'
            ],
            expectedStatus: 404,
            maxResponseTime: 2000,
            severity: 'normal',
            story: 'Ошибка при создании пакета с несуществующими контрактами'
        }
    ]
};

// Вспомогательные функции с обработкой ошибок
const safeObjectEntries = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return [];
    }
    return Object.entries(obj);
};

// Безопасное преобразование headers в объект
const safeHeadersToObject = (headers) => {
    try {
        if (!headers) return {};

        // Если headers уже объект
        if (typeof headers === 'object' && !Array.isArray(headers)) {
            return headers;
        }

        // Если headers имеет метод entries (как в Playwright)
        if (headers.entries && typeof headers.entries === 'function') {
            return Object.fromEntries(headers.entries());
        }

        // Если headers - Map или подобное
        if (headers instanceof Map) {
            return Object.fromEntries(headers);
        }

        return {};
    } catch (error) {
        console.warn('Error converting headers to object:', error);
        return {};
    }
};

const makeApiRequest = async (request, requestBody, testName) => {
    return await step(`Отправка POST запроса для создания пакета: ${testName}`, async () => {
        try {
            const startTime = Date.now();
            const response = await request.post('v1/packages', {
                data: requestBody,
                headers: BASE_CONFIG.defaultHeaders
            });
            const responseTime = Date.now() - startTime;

            await attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
            await attachment('Performance Metrics',
                `Response Time: ${responseTime}ms\nStatus Code: ${response.status()}`,
                'text/plain'
            );

            return { response, responseTime };
        } catch (error) {
            await attachment('Request Error', `Ошибка при выполнении запроса: ${error.message}`, 'text/plain');
            throw error;
        }
    });
};

const validateSuccessResponse = async (response, responseTime, maxResponseTime, testName) => {
    await step(`Валидация успешного ответа: ${testName}`, async () => {
        try {
            // 1. Status code
            expect(response.status(), `[${testName}] Status code should be 201`).toBe(201);

            // 2. Response time
            expect(responseTime, `[${testName}] Response time ${responseTime}ms should be less than ${maxResponseTime}ms`).toBeLessThan(maxResponseTime);

            // 3. Content-Type - безопасное получение headers
            const headers = safeHeadersToObject(response.headers());
            const contentType = headers['content-type'];
            expect(contentType, `[${testName}] Content-Type should be application/json`).toContain('application/json');

            await attachment('Response Headers', JSON.stringify(headers, null, 2), 'application/json');
        } catch (error) {
            await attachment('Validation Error', `Ошибка валидации ответа: ${error.message}`, 'text/plain');
            throw error;
        }
    });
};

const validateErrorResponse = async (response, responseTime, maxResponseTime, testName) => {
    await step(`Валидация ошибочного ответа: ${testName}`, async () => {
        try {
            // 1. Status code
            expect(response.status(), `[${testName}] Status code should be 404`).toBe(404);

            // 2. Response time
            expect(responseTime, `[${testName}] Response time ${responseTime}ms should be less than ${maxResponseTime}ms`).toBeLessThan(maxResponseTime);

            // 3. Content-Type - безопасное получение headers
            const headers = safeHeadersToObject(response.headers());
            const contentType = headers['content-type'];
            expect(contentType, `[${testName}] Content-Type should be application/json`).toContain('application/json');

            await attachment('Response Headers', JSON.stringify(headers, null, 2), 'application/json');
        } catch (error) {
            await attachment('Validation Error', `Ошибка валидации ответа: ${error.message}`, 'text/plain');
            throw error;
        }
    });
};

const validateResponseId = async (response, testName) => {
    return await step(`Валидация ID созданного пакета: ${testName}`, async () => {
        try {
            const responseData = await response.json();

            // Проверяем что responseData - объект
            if (!responseData || typeof responseData !== 'object') {
                throw new Error(`Response data is not a valid object. Type: ${typeof responseData}`);
            }

            expect(responseData.id, `[${testName}] Response body should contain id`).toBeDefined();
            expect(typeof responseData.id, `[${testName}] ID should be a string`).toBe('string');
            expect(responseData.id.length, `[${testName}] ID should not be empty`).toBeGreaterThan(0);

            await attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');
            await attachment('Package ID', `Создан пакет с ID: ${responseData.id}`, 'text/plain');

            return responseData;
        } catch (error) {
            await attachment('ID Validation Error', `Ошибка валидации ID: ${error.message}`, 'text/plain');
            throw error;
        }
    });
};

const validateErrorResponseBody = async (response, testName) => {
    return await step(`Валидация тела ошибочного ответа: ${testName}`, async () => {
        try {
            const responseData = await response.json();

            // Проверяем что responseData - объект
            if (!responseData || typeof responseData !== 'object') {
                throw new Error(`Response data is not a valid object. Type: ${typeof responseData}`);
            }

            // 4. Response has status object
            expect(responseData.status, `[${testName}] Response should have status object`).toBeDefined();
            expect(responseData.status, `[${testName}] Status should have code property`).toHaveProperty('code');
            expect(responseData.status, `[${testName}] Status should have description property`).toHaveProperty('description');

            // 5. Response has errors array
            expect(responseData.errors, `[${testName}] Response should have errors array`).toBeDefined();
            expect(Array.isArray(responseData.errors), `[${testName}] Errors should be an array`).toBe(true);
            expect(responseData.errors.length, `[${testName}] Errors array should not be empty`).toBeGreaterThan(0);

            // Проверка каждой ошибки в массиве
            responseData.errors.forEach((error, index) => {
                if (!error || typeof error !== 'object') {
                    throw new Error(`Error ${index} is not a valid object`);
                }

                expect(error, `[${testName}] Error ${index} should have key`).toHaveProperty('key');
                expect(error, `[${testName}] Error ${index} should have code`).toHaveProperty('code');
                expect(error, `[${testName}] Error ${index} should have description`).toHaveProperty('description');

                expect(typeof error.key, `[${testName}] Error ${index} key should be string`).toBe('string');
                expect(typeof error.code, `[${testName}] Error ${index} code should be string`).toBe('string');
                expect(typeof error.description, `[${testName}] Error ${index} description should be string`).toBe('string');

                expect(error.key.length, `[${testName}] Error ${index} key should not be empty`).toBeGreaterThan(0);
                expect(error.code.length, `[${testName}] Error ${index} code should not be empty`).toBeGreaterThan(0);
                expect(error.description.length, `[${testName}] Error ${index} description should not be empty`).toBeGreaterThan(0);
            });

            await attachment('Error Response Body', JSON.stringify(responseData, null, 2), 'application/json');
            await attachment('Errors Summary',
                `Найдено ошибок: ${responseData.errors.length}\nКод статуса: ${responseData.status?.code}\nОписание: ${responseData.status?.description}`,
                'text/plain'
            );

            return responseData;
        } catch (error) {
            await attachment('Error Body Validation Error', `Ошибка валидации тела ошибки: ${error.message}`, 'text/plain');
            throw error;
        }
    });
};

const safeJSONStringify = (obj, space = 2) => {
    try {
        return JSON.stringify(obj, null, space);
    } catch (error) {
        return `Ошибка сериализации JSON: ${error.message}`;
    }
};

// Основной тестовый блок
test.describe('API Tests - Создание пакетов документов', () => {
    test.beforeEach(() => {
        epic('EqvaCollection API');
        feature('Создание пакетов документов');
        owner('API Team');
        tag('package-creation');
        tag('smoke');
        tag('regression');
    });

    // Тесты для успешных сценариев
    TEST_CASES.success.forEach(testCase => {
        test(`[201 CODE] Пакет документов успешно создан (${testCase.name})`, async ({ request }) => {
            // Allure метаданные для теста
            story(testCase.story);
            severity(testCase.severity);
            description(`Создание пакета документов типа ${testCase.packageTypeId} с контрактами: ${testCase.contractIds.join(', ')}`);

            const requestBody = {
                courtLawyerId: BASE_CONFIG.courtLawyerId,
                packageTypeId: testCase.packageTypeId,
                contractIds: testCase.contractIds
            };

            await step('Подготовка тестовых данных', async () => {
                try {
                    await attachment('Test Case Details', safeJSONStringify({
                        name: testCase.name,
                        packageTypeId: testCase.packageTypeId,
                        contractIds: testCase.contractIds,
                        expectedStatus: testCase.expectedStatus,
                        maxResponseTime: testCase.maxResponseTime
                    }), 'application/json');
                } catch (error) {
                    await attachment('Preparation Error', `Ошибка подготовки данных: ${error.message}`, 'text/plain');
                    throw error;
                }
            });

            const { response, responseTime } = await makeApiRequest(request, requestBody, testCase.name);

            await validateSuccessResponse(response, responseTime, testCase.maxResponseTime, testCase.name);
            await validateResponseId(response, testCase.name);
        });
    });

    // Тесты для ошибочных сценариев
    TEST_CASES.error.forEach(testCase => {
        test(`[${testCase.expectedStatus} CODE] ${testCase.name}`, async ({ request }) => {
            // Allure метаданные для теста
            story(testCase.story);
            severity(testCase.severity);
            description(`Попытка создания пакета с несуществующими контрактами: ${testCase.contractIds.join(', ')}`);

            const requestBody = {
                courtLawyerId: BASE_CONFIG.courtLawyerId,
                packageTypeId: testCase.packageTypeId,
                contractIds: testCase.contractIds
            };

            await step('Подготовка тестовых данных для негативного сценария', async () => {
                try {
                    await attachment('Negative Test Case Details', safeJSONStringify({
                        name: testCase.name,
                        packageTypeId: testCase.packageTypeId,
                        contractIds: testCase.contractIds,
                        expectedStatus: testCase.expectedStatus,
                        maxResponseTime: testCase.maxResponseTime
                    }), 'application/json');
                    await attachment('Expected Behavior', 'Ожидается ошибка 404 с детальной информацией о не найденных контрактах', 'text/plain');
                } catch (error) {
                    await attachment('Preparation Error', `Ошибка подготовки данных: ${error.message}`, 'text/plain');
                    throw error;
                }
            });

            const { response, responseTime } = await makeApiRequest(request, requestBody, testCase.name);

            await validateErrorResponse(response, responseTime, testCase.maxResponseTime, testCase.name);
            await validateErrorResponseBody(response, testCase.name);
        });
    });
});