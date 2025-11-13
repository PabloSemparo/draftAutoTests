// tests/packages-get.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from "allure-playwright";
import { ApiResponse, PackageResponse, TEST_CONSTANTS, TEST_CONFIG } from './shared/types';
import { TestUtils } from './shared/test-utils';

// Глобальные хуки для всей test suite
test.beforeAll(async () => {
    console.log('🚀 Запуск тестовой серии: Получение пакета документов');
});

test.afterAll(async () => {
    console.log('✅ Тестовая серия завершена: Получение пакета документов');
});

test.describe('API: Получить описание пакета документов по его ID', () => {
    const { VALID_PACKAGE_ID, BASE_URL } = TEST_CONSTANTS;
    const { STATUS_CODES, STATUS_TEXTS, ERROR_DESCRIPTIONS, RESPONSE_TIME } = TEST_CONFIG;

    // Хуки для группы тестов
    test.beforeEach(async ({}, testInfo) => {
        console.log(`📝 Начало теста: ${testInfo.title}`);
        TestUtils.setTestContext(testInfo);
    });

    test.afterEach(async ({}, testInfo) => {
        console.log(`🏁 Завершение теста: ${testInfo.title}`);
        await TestUtils.cleanupTest();
    });

    test('[200] Описание пакета получено', async ({ request }) => {
        let testSuccess = false;

        try {
            await TestUtils.setupAllure(
                "EqvaCollection API",
                "Получение пакета документов",
                "Успешные сценарии",
                "critical",
                ["smoke", "regression"]
            );
            await TestUtils.setupParentSuite("Packages API", "Get Package");
            await allure.owner("API Team");

            const packageId = VALID_PACKAGE_ID;

            await TestUtils.logStep("Подготовка тестовых данных", async () => {
                await TestUtils.logParameters({
                    "Package ID": packageId,
                    "Method": "GET",
                    "Expected Status": "200"
                });
            });

            let response: any;
            const startTime = Date.now();

            await TestUtils.logStep("Отправка GET запроса для получения пакета", async () => {
                response = await request.get(`${BASE_URL}/v1/packages/${packageId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            });

            const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.VERY_FAST);

            await TestUtils.logStep("Проверка статус кода 200", async () => {
                TestUtils.validateStatusCode(response.status(), STATUS_CODES.SUCCESS);
            });

            await TestUtils.logStep("Проверка Content-Type", async () => {
                TestUtils.validateContentType(response.headers());
            });

            const responseBody: PackageResponse = await response.json();

            await TestUtils.logStep("Проверка структуры ответа", async () => {
                TestUtils.validatePackageResponseStructure(responseBody);
            });

            await TestUtils.logStep("Проверка типов данных полей", async () => {
                TestUtils.validateStringField(responseBody.id, 'id');
                TestUtils.validateNumberField(responseBody.number, 'number');
                TestUtils.validateStringField(responseBody.typeId, 'typeId');
                TestUtils.validateStringField(responseBody.statusCode, 'statusCode');
                TestUtils.validateStringField(responseBody.createdAt, 'createdAt');
                TestUtils.validateStringField(responseBody.responsibleLawyerId, 'responsibleLawyerId');
                TestUtils.validateArrayField(responseBody.includedContracts, 'includedContracts');
            });

            await TestUtils.logStep("Проверка массива includedContracts", async () => {
                expect(responseBody.includedContracts, 'Массив includedContracts не должен быть null').not.toBeNull();
                responseBody.includedContracts.forEach((contract, index) => {
                    expect(typeof contract, `Contract[${index}] должен быть строкой`).toBe('string');
                });
            });

            await TestUtils.logStep("Проверка поля createdAt", async () => {
                TestUtils.validateDateField(responseBody.createdAt);
            });

            await TestUtils.logStep("Проверка поля responsibleLawyerId", async () => {
                TestUtils.validateResponsibleLawyerId(responseBody.responsibleLawyerId);
            });

            await TestUtils.logStep("Логирование успешного выполнения", async () => {
                await TestUtils.logAttachment("Response Body", responseBody);
                await TestUtils.logAttachment("Response Headers", response.headers());
            });

            testSuccess = true;

        } catch (error) {
            console.error('❌ Ошибка во время выполнения теста:', error);
            throw error;
        } finally {
            await TestUtils.finalizeTest(testSuccess, "Описание пакета успешно получено");
        }
    });

    test('[400] Некорректный формат запроса - отсутствует ID', async ({ request }) => {
        let testSuccess = false;

        try {
            await TestUtils.setupAllure(
                "EqvaCollection API",
                "Получение пакета документов",
                "Ошибки валидации",
                "high",
                ["validation"]
            );

            const emptyId = ':id';

            await TestUtils.logStep("Подготовка запроса с пустым ID", async () => {
                await TestUtils.logParameters({
                    "Package ID": "EMPTY",
                    "Expected Error": "Некорректный формат запроса"
                });
            });

            let response: any;
            const startTime = Date.now();

            await TestUtils.logStep("Отправка запроса с пустым ID", async () => {
                response = await request.get(`${BASE_URL}/v1/packages/${emptyId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            });

            const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.VERY_FAST);

            await TestUtils.logStep("Проверка статус кода 400", async () => {
                TestUtils.validateStatusCode(response.status(), STATUS_CODES.BAD_REQUEST);
            });

            const responseBody: ApiResponse = await response.json();

            await TestUtils.logStep("Проверка структуры ответа", async () => {
                TestUtils.validateApiResponseStructure(responseBody);

                expect(responseBody.status.code, 'Код статуса должен быть BAD_REQUEST').toBe(STATUS_TEXTS.BAD_REQUEST);
                expect(responseBody.status.description, 'Описание должно соответствовать').toBe(ERROR_DESCRIPTIONS.BAD_REQUEST);

                expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
                expect(responseBody.errors, 'Массив ошибок должен содержать элементы').toHaveLength(1);

                const error = responseBody.errors![0];
                TestUtils.validateErrorStructure(error, 'id', 'TYPEMISMATCH');
                expect(error.description, 'Описание ошибки должно содержать информацию о конвертации').toMatch(/Failed to convert value/);
                expect(error.description, 'Описание ошибки должно содержать информацию о UUID').toMatch(/Invalid UUID string/);

                expect(responseBody.details, 'Details должен быть null').toBeNull();
            });

            await TestUtils.logStep("Логирование ошибки валидации", async () => {
                await TestUtils.logAttachment("Error Response", responseBody);
                await TestUtils.logAttachment("Request Details", "Запрос отправлен с пустым ID", "text/plain");
            });

            testSuccess = true;

        } catch (error) {
            console.error('❌ Ошибка во время выполнения теста:', error);
            throw error;
        } finally {
            await TestUtils.finalizeTest(testSuccess, "Ошибка валидации корректно обработана");
        }
    });

    test('[400] Некорректный формат запроса - ID не соответствует UUID', async ({ request }) => {
        let testSuccess = false;

        try {
            await TestUtils.setupAllure(
                "EqvaCollection API",
                "Получение пакета документов",
                "Ошибки валидации",
                "high",
                ["validation"]
            );

            const invalidId = '344334';

            await TestUtils.logStep("Подготовка запроса с невалидным UUID", async () => {
                await TestUtils.logParameters({
                    "Package ID": invalidId,
                    "Expected Error": "Некорректный формат UUID"
                });
            });

            let response: any;
            const startTime = Date.now();

            await TestUtils.logStep("Отправка запроса с невалидным ID", async () => {
                response = await request.get(`${BASE_URL}/v1/packages/${invalidId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            });

            const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.VERY_FAST);

            await TestUtils.logStep("Проверка статус кода 400", async () => {
                TestUtils.validateStatusCode(response.status(), STATUS_CODES.BAD_REQUEST);
            });

            const responseBody: ApiResponse = await response.json();

            await TestUtils.logStep("Проверка структуры ошибки", async () => {
                TestUtils.validateApiResponseStructure(responseBody);

                expect(responseBody.status.code, 'Код статуса должен быть BAD_REQUEST').toBe(STATUS_TEXTS.BAD_REQUEST);

                expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
                expect(responseBody.errors, 'Массив ошибок должен содержать элементы').toHaveLength(1);

                const error = responseBody.errors![0];
                TestUtils.validateErrorStructure(error, 'id', 'TYPEMISMATCH');
                expect(error.description, 'Описание должно содержать Method parameter').toContain("Method parameter 'id'");
                expect(error.description, 'Описание должно содержать информацию о UUID').toMatch(/Invalid UUID string: 344334/);
            });

            await TestUtils.logStep("Логирование ошибки валидации", async () => {
                await TestUtils.logAttachment("Error Response", responseBody);
            });

            testSuccess = true;

        } catch (error) {
            console.error('❌ Ошибка во время выполнения теста:', error);
            throw error;
        } finally {
            await TestUtils.finalizeTest(testSuccess, "Ошибка формата UUID корректно обработана");
        }
    });

    test('[422] Ошибка валидации параметров запроса', async ({ request }) => {
        let testSuccess = false;

        try {
            await TestUtils.setupAllure(
                "EqvaCollection API",
                "Получение пакета документов",
                "Ошибки валидации",
                "high",
                ["validation"]
            );

            const packageId = VALID_PACKAGE_ID;

            let response: any;
            const startTime = Date.now();

            await TestUtils.logStep("Отправка запроса для получения 422 ошибки", async () => {
                response = await request.get(`${BASE_URL}/v1/packages/${packageId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            });

            const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.VERY_FAST);
            const statusCode = response.status();

            await TestUtils.logStep("Проверка статус кода", async () => {
                await TestUtils.validateExpectedStatusCodes(statusCode, [STATUS_CODES.SUCCESS, STATUS_CODES.VALIDATION_ERROR]);
            });

            if (statusCode === STATUS_CODES.VALIDATION_ERROR) {
                const responseBody: ApiResponse = await response.json();

                await TestUtils.logStep("Проверка структуры 422 ошибки", async () => {
                    expect(responseBody.status.code).toBe(STATUS_TEXTS.VALIDATION_ERROR);
                    expect(responseBody.errors).toBeDefined();
                    expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);

                    await TestUtils.logAttachment("422 Error Details", responseBody);
                });
            } else {
                await TestUtils.logStep("Логирование успешного ответа", async () => {
                    await TestUtils.logAttachment("Success Response", `Status: ${statusCode}`, "text/plain");
                });
            }

            testSuccess = true;

        } catch (error) {
            console.error('❌ Ошибка во время выполнения теста:', error);
            throw error;
        } finally {
            await TestUtils.finalizeTest(testSuccess, "Ошибка валидации параметров корректно обработана");
        }
    });

    test('[500] Ошибка обработки запроса', async ({ request }) => {
        let testSuccess = false;

        try {
            await TestUtils.setupAllure(
                "EqvaCollection API",
                "Получение пакета документов",
                "Ошибки сервера",
                "critical",
                ["server-error"]
            );

            const packageId = VALID_PACKAGE_ID;

            let response: any;
            const startTime = Date.now();

            await TestUtils.logStep("Отправка запроса для проверки 500 ошибки", async () => {
                response = await request.get(`${BASE_URL}/v1/packages/${packageId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            });

            const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.VERY_FAST);
            const statusCode = response.status();

            await TestUtils.logStep("Проверка возможных статус кодов", async () => {
                await TestUtils.validateExpectedStatusCodes(statusCode, [STATUS_CODES.SUCCESS, STATUS_CODES.SERVER_ERROR]);
            });

            if (statusCode === STATUS_CODES.SERVER_ERROR) {
                const responseBody: ApiResponse = await response.json();

                await TestUtils.logStep("Проверка структуры 500 ошибки", async () => {
                    expect(responseBody.status.code).toBeDefined();
                    expect(responseBody.errors).toBeDefined();

                    await TestUtils.logAttachment("500 Server Error", responseBody);
                });
            } else {
                await TestUtils.logStep("Логирование нормального ответа", async () => {
                    await TestUtils.logAttachment("Normal Response", `Status: ${statusCode}`, "text/plain");
                });
            }

            testSuccess = true;

        } catch (error) {
            console.error('❌ Ошибка во время выполнения теста:', error);
            throw error;
        } finally {
            await TestUtils.finalizeTest(testSuccess, "Ошибка сервера корректно обработана");
        }
    });
});