// tests/packages-print.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from "allure-playwright";
import { ApiResponse, DocumentRequest, TEST_CONSTANTS, TEST_CONFIG } from './types';
import { TestUtils } from './test-utils';

test.describe('API: Отправка документов пакета на печать', () => {
    const { VALID_PACKAGE_ID, VALID_COURT_LAWYER_ID, BASE_URL } = TEST_CONSTANTS;
    const { STATUS_CODES, STATUS_TEXTS, ERROR_DESCRIPTIONS, RESPONSE_TIME } = TEST_CONFIG;

    test('[200] Документы пакета успешно отправлены на печать', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Отправка документов на печать",
            "Успешные сценарии",
            "critical",
            ["smoke", "regression"]
        );
        await TestUtils.setupParentSuite("API Tests", "Packages API", "Print Documents");
        await allure.owner("API Team");

        const requestBody: DocumentRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        await TestUtils.logStep("Подготовка тестовых данных", async () => {
            await TestUtils.logParameters({
                "Package ID": VALID_PACKAGE_ID,
                "Court Lawyer ID": VALID_COURT_LAWYER_ID
            });
        });

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка POST запроса на печать", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/print`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.NORMAL);

        await TestUtils.logStep("Проверка статус кода 200", async () => {
            TestUtils.validateStatusCode(response.status(), STATUS_CODES.SUCCESS);
        });

        await TestUtils.logStep("Проверка наличия заголовка vary", async () => {
            const headers = response.headers();
            expect(headers.vary, 'Заголовок vary должен присутствовать').toBeDefined();
        });

        await TestUtils.logStep("Логирование успешного выполнения", async () => {
            await TestUtils.logAttachment("Request Body", requestBody);
            await TestUtils.logAttachment("Response Headers", response.headers());
        });
    });

    test('[400] Некорректный формат запроса - отсутствует ID', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Отправка документов на печать",
            "Ошибки валидации",
            "high",
            ["validation"]
        );

        await TestUtils.logStep("Подготовка запроса с пустым ID пакета", async () => {
            await TestUtils.logParameters({
                "Package ID": "EMPTY",
                "Request Body": "NOT PROVIDED"
            });
        });

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка запроса с пустым ID без тела запроса", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/:id/print`, {
                headers: { 'Accept': 'application/json' }
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
            await TestUtils.logAttachment("Request Details", "Запрос отправлен без тела, только с пустым ID в URL", "text/plain");
        });
    });

    test('[400] Некорректный формат запроса - ID равен null', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Отправка документов на печать",
            "Ошибки валидации",
            "high",
            ["validation"]
        );

        await TestUtils.logStep("Подготовка запроса с ID = null", async () => {
            await TestUtils.logParameters({
                "Package ID": "null",
                "Request Body": "NOT PROVIDED"
            });
        });

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка запроса с null ID без тела запроса", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/null/print`, {
                headers: { 'Accept': 'application/json' }
            });
        });

        const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.VERY_FAST);

        await TestUtils.logStep("Проверка статус кода 400", async () => {
            TestUtils.validateStatusCode(response.status(), STATUS_CODES.BAD_REQUEST);
        });

        const responseBody: ApiResponse = await response.json();

        await TestUtils.logStep("Проверка структуры ошибки", async () => {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив ошибок должен содержать элементы').toHaveLength(1);

            const error = responseBody.errors![0];
            expect(error.description, 'Описание должно содержать "Invalid UUID string: null"').toContain('Invalid UUID string: null');

            await TestUtils.logAttachment("Validation Error", error);
        });
    });

    test('[400] Некорректный формат запроса - ID не UUID', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Отправка документов на печать",
            "Ошибки валидации",
            "high",
            ["validation"]
        );

        const invalidId = 'not-a-uuid';

        await TestUtils.logStep("Подготовка запроса с невалидным UUID", async () => {
            await TestUtils.logParameters({
                "Package ID": invalidId,
                "Request Body": "NOT PROVIDED"
            });
        });

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка запроса с невалидным ID без тела запроса", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${invalidId}/print`, {
                headers: { 'Accept': 'application/json' }
            });
        });

        const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.VERY_FAST);

        await TestUtils.logStep("Проверка статус кода 400", async () => {
            TestUtils.validateStatusCode(response.status(), STATUS_CODES.BAD_REQUEST);
        });

        const responseBody: ApiResponse = await response.json();

        await TestUtils.logStep("Проверка описания ошибки", async () => {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив ошибок должен содержать элементы').toHaveLength(1);

            const error = responseBody.errors![0];
            expect(error.description, 'Описание должно содержать Method parameter').toContain("Method parameter 'id'");
            expect(error.description, 'Описание должно содержать java.lang.String').toContain('java.lang.String');
            expect(error.description, 'Описание должно содержать java.util.UUID').toContain('java.util.UUID');

            await TestUtils.logAttachment("Full Error Response", responseBody);
        });
    });

    test('[422] Ошибка валидации параметров запроса', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Отправка документов на печать",
            "Ошибки валидации",
            "high",
            ["validation"]
        );

        const requestBody: DocumentRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка запроса для получения 422 ошибки", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/print`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.NORMAL);
        const statusCode = response.status();

        await TestUtils.logStep("Проверка статус кода", async () => {
            await TestUtils.validateExpectedStatusCodes(statusCode, [STATUS_CODES.SUCCESS, STATUS_CODES.VALIDATION_ERROR]);
        });

        if (statusCode === STATUS_CODES.VALIDATION_ERROR) {
            const responseBody: ApiResponse = await response.json();

            await TestUtils.logStep("Проверка структуры 422 ошибки", async () => {
                expect(responseBody.status.code).toBe(STATUS_TEXTS.VALIDATION_ERROR);
                expect(responseBody.errors).toBeDefined();

                await TestUtils.logAttachment("422 Error Details", responseBody);
            });
        } else {
            await TestUtils.logStep("Логирование успешного ответа", async () => {
                await TestUtils.logAttachment("Success Response", `Status: ${statusCode}`, "text/plain");
            });
        }
    });

    test('[500] Ошибка обработки запроса', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Отправка документов на печать",
            "Ошибки сервера",
            "critical",
            ["server-error"]
        );

        const requestBody: DocumentRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка запроса для проверки 500 ошибки", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/print`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.NORMAL);
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
    });
});