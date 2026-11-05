// tests/eq-debt-collection-convert-to-gas.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from "allure-playwright";
import { ApiResponse, DocumentRequest, TEST_CONSTANTS, TEST_CONFIG } from './types';
import { TestUtils } from './test-utils';

test.describe('API: Конвертировать документы пакета в PDF для отправки в ГАС', () => {
    const { VALID_PACKAGE_ID, VALID_COURT_LAWYER_ID, INVALID_PACKAGE_ID, BASE_URL } = TEST_CONSTANTS;
    const { STATUS_CODES, STATUS_TEXTS, ERROR_DESCRIPTIONS, RESPONSE_TIME } = TEST_CONFIG;

    test('[200] Успешно сконвертированы документы пакета в PDF для отправки в ГАС', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Конвертация документов в PDF",
            "Успешные сценарии",
            "critical",
            ["smoke", "regression"]
        );
        await TestUtils.setupParentSuite("API Tests", "Packages API", "Convert to PDF");
        await allure.owner("API Team");

        const requestBody: DocumentRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        await TestUtils.logStep("Подготовка тестовых данных", async () => {
            await TestUtils.logParameters({
                "Package ID": VALID_PACKAGE_ID,
                "Court Lawyer ID": VALID_COURT_LAWYER_ID,
                "Document IDs": "Пустой массив"
            });
        });

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка POST запроса на конвертацию в PDF", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/convert`, {
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

        await TestUtils.logStep("Проверка наличия заголовка date", async () => {
            const headers = response.headers();
            expect(headers.date, 'Заголовок date должен присутствовать').toBeDefined();
        });

        await TestUtils.logStep("Логирование успешного выполнения", async () => {
            await TestUtils.logAttachment("Request Body", requestBody);
            await TestUtils.logAttachment("Response Headers", response.headers());
        });
    });

    test('[422] Для данного пакета не доступна отправка в ГАС', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Конвертация документов в PDF",
            "Ошибки валидации",
            "high",
            ["validation", "gas-validation"]
        );

        const requestBody: DocumentRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        await TestUtils.logStep("Подготовка тестовых данных для 422 ошибки", async () => {
            await TestUtils.logParameters({
                "Package ID": INVALID_PACKAGE_ID,
                "Court Lawyer ID": VALID_COURT_LAWYER_ID,
                "Expected Error": "Для данного пакета не доступна отправка в ГАС"
            });
        });

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка запроса с пакетом, недоступным для ГАС", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${INVALID_PACKAGE_ID}/convert`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.FAST);

        await TestUtils.logStep("Проверка статус кода 422", async () => {
            TestUtils.validateStatusCode(response.status(), STATUS_CODES.VALIDATION_ERROR);
        });

        await TestUtils.logStep("Проверка Content-Type", async () => {
            const headers = response.headers();
            expect(headers['content-type'], 'Content-Type должен быть application/json').toContain('application/json');
        });

        const responseBody: ApiResponse = await response.json();

        await TestUtils.logStep("Проверка структуры ответа", async () => {
            TestUtils.validateApiResponseStructure(responseBody);

            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив ошибок не должен быть пустым').not.toHaveLength(0);

            if (responseBody.errors && responseBody.errors.length > 0) {
                responseBody.errors.forEach((error, index) => {
                    TestUtils.validateErrorStructure(error);
                });
            }
        });

        await TestUtils.logStep("Логирование ошибки валидации", async () => {
            await TestUtils.logAttachment("422 Error Response", responseBody);
            await TestUtils.logAttachment("Request Details", {
                packageId: INVALID_PACKAGE_ID,
                courtLawyerId: VALID_COURT_LAWYER_ID,
                documentIds: []
            });
        });
    });

    test('[400] Неправильный формат запроса', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Конвертация документов в PDF",
            "Ошибки валидации",
            "high",
            ["validation"]
        );

        const invalidRequestBody = {
            courtLawyerId: "invalid-uuid-format",
            documentIds: []
        };

        await TestUtils.logStep("Подготовка невалидных тестовых данных", async () => {
            await TestUtils.logParameters({
                "Package ID": VALID_PACKAGE_ID,
                "Court Lawyer ID": "invalid-uuid-format",
                "Expected Error": "Неправильный формат запроса"
            });
        });

        let response: any;
        const startTime = Date.now();

        await TestUtils.logStep("Отправка запроса с невалидными данными", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/convert`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: invalidRequestBody
            });
        });

        const responseTime = await TestUtils.validateResponseTime(startTime, RESPONSE_TIME.FAST);

        await TestUtils.logStep("Проверка статус кода 400", async () => {
            TestUtils.validateStatusCode(response.status(), STATUS_CODES.BAD_REQUEST);
        });

        const responseBody: ApiResponse = await response.json();

        await TestUtils.logStep("Проверка структуры ошибки", async () => {
            expect(responseBody.status.code, 'Код статуса должен быть BAD_REQUEST').toBe(STATUS_TEXTS.BAD_REQUEST);
            expect(responseBody.status.description, 'Описание должно соответствовать').toBe(ERROR_DESCRIPTIONS.BAD_REQUEST);
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
        });

        await TestUtils.logStep("Логирование ошибки 400", async () => {
            await TestUtils.logAttachment("400 Error Response", responseBody);
        });
    });

    test('[500] Ошибка обработки запроса', async ({ request }) => {
        await TestUtils.setupAllure(
            "EqvaCollection API",
            "Конвертация документов в PDF",
            "Ошибки сервера",
            "critical",
            ["server-error"]
        );

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

        await TestUtils.logStep("Отправка запроса для проверки 500 ошибки", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/convert`, {
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