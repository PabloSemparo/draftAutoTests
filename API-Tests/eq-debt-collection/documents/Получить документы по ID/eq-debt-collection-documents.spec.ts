import { test, expect, APIResponse } from '@playwright/test';
import { allure } from "allure-playwright";

const baseUrl = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe('v1/packages/{id}/documents [Получить документы пакета по его ID]', () => {

    test('[200 CODE] Документы внутри пакета получены по его ID', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Package Documents");

        await allure.epic("Documents Management");
        await allure.feature("Получение документов пакета");
        await allure.story("Успешное получение документов");

        await allure.severity("critical");
        await allure.owner("API Team");
        await allure.tag("smoke");
        await allure.tag("regression");

        const packagesId = process.env.PACKAGES_ID || '019a788b-f2ce-7be1-b143-eec8c1509ebf';

        await allure.step("Подготовка тестовых данных", async () => {
            await allure.parameter("Package ID", packagesId);
            await allure.parameter("Page Number", "0");
            await allure.parameter("Page Size", "100");
        });

        let response: APIResponse;
        const startTime = Date.now();

        await allure.step("Отправка GET запроса для получения документов пакета", async () => {
            response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents`, {
                params: {
                    pageNumber: '0',
                    pageSize: '100'
                },
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 200", async () => {
            expect(statusCode, 'Статус код должен быть 200').toBe(200);
        });

        await allure.step("Проверка времени ответа < 2000ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 2000ms').toBeLessThan(2000);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        const responseBody = await response.json();

        await allure.step("Проверка структуры ответа", async () => {
            // Test for response body structure
            expect(responseBody).toHaveProperty('items');
            expect(responseBody).toHaveProperty('pageNumber');
            expect(responseBody).toHaveProperty('pageSize');
            expect(responseBody).toHaveProperty('hasMore');
            expect(responseBody).toHaveProperty('totalItems');

            // Test for items array
            expect(Array.isArray(responseBody.items)).toBe(true);
        });

        await allure.step("Проверка структуры каждого элемента в items", async () => {
            // Test for each item in the items array
            responseBody.items.forEach((item: any) => {
                expect(item).toHaveProperty('id');
                expect(item).toHaveProperty('packageId');
                expect(item).toHaveProperty('contractId');
                expect(item).toHaveProperty('settingsPackageId');
                expect(item).toHaveProperty('generalType');
                expect(item).toHaveProperty('typeId');
                expect(item).toHaveProperty('status');
            });
        });

        await allure.step("Извлечение и сохранение первого ID документа", async () => {
            // Check if response has items array and it's not empty
            if (responseBody && responseBody.items && Array.isArray(responseBody.items) && responseBody.items.length > 0) {
                const firstId = responseBody.items[0].id;

                // In Playwright, we can store variables in test context or use environment variables
                // For global variables, you might want to use process.env or a shared context
                process.env.FIRST_ITEM_ID = firstId;

                // Verify the operation was successful
                expect(process.env.FIRST_ITEM_ID).toBe(firstId);
                await allure.parameter("First Item ID", firstId);
            } else {
                throw new Error('Response does not contain valid items array or array is empty');
            }
        });

        await allure.step("Логирование успешного выполнения", async () => {
            await allure.attachment("Response Body", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[400 CODE BAD_REQUEST] Некорректный формат запроса (Не передан id пакета)', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Package Documents");

        await allure.epic("Documents Management");
        await allure.feature("Получение документов пакета");
        await allure.story("Ошибки валидации");

        await allure.severity("high");
        await allure.owner("API Team");
        await allure.tag("validation");
        await allure.tag("bad-request");

        await allure.step("Подготовка тестовых данных для 400 ошибки", async () => {
            await allure.parameter("Package ID", "не передан");
            await allure.parameter("Expected Error", "Некорректный формат запроса");
        });

        let response: APIResponse;
        const startTime = Date.now();

        await allure.step("Отправка запроса без ID пакета", async () => {
            response = await request.get(`${baseUrl}/v1/packages/:id/documents`, {
                params: {
                    pageNumber: '0',
                    pageSize: '25'
                },
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 400", async () => {
            expect(response.status()).toBe(400);
        });

        await allure.step("Проверка времени ответа < 5000ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 5000ms').toBeLessThan(5000);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        await allure.step("Проверка заголовка Content-Type", async () => {
            expect(response.headers()['content-type']).toContain('application/json');
        });

        const responseBody = await response.json();

        await allure.step("Проверка структуры ответа об ошибке", async () => {
            // 4. Проверка общей структуры ответа
            expect(responseBody).toBeInstanceOf(Object);
            expect(responseBody).toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');

            // 5. Проверка объекта status
            expect(responseBody.status).toBeInstanceOf(Object);
            expect(responseBody.status).toHaveProperty('code');
            expect(responseBody.status).toHaveProperty('description');
            expect(responseBody.status.code).toBe('BAD_REQUEST');
            expect(responseBody.status.description).toBe('Некорректный формат запроса');

            // 6. Проверка массива errors
            expect(Array.isArray(responseBody.errors)).toBe(true);
            expect(responseBody.errors).toHaveLength(1);
        });

        await allure.step("Детальная проверка ошибки", async () => {
            // 7. Проверка структуры ошибки
            const error = responseBody.errors[0];
            expect(error).toBeInstanceOf(Object);
            expect(error).toHaveProperty('key');
            expect(error).toHaveProperty('code');
            expect(error).toHaveProperty('description');
            expect(error.key).toBe('id');
            expect(error.code).toBe('TYPEMISMATCH');

            // Проверка описания ошибки
            const expectedDescriptionParts = [
                "Method parameter 'id'",
                "Failed to convert value of type 'java.lang.String'",
                "required type 'java.util.UUID'",
                "Invalid UUID string: :id"
            ];

            expectedDescriptionParts.forEach(part => {
                expect(error.description).toContain(part);
            });

            // 8. Проверка поля details
            expect(responseBody.details).toBeNull();

            // 9. Дополнительная проверка с регулярным выражением
            const pattern = /Method parameter 'id': Failed to convert value of type 'java\.lang\.String' to required type 'java\.util\.UUID'; Invalid UUID string: :id/;
            expect(error.description).toMatch(pattern);

            // 10. Проверка формата UUID в описании ошибки
            expect(error.description).toMatch(/java\.util\.UUID/);
        });

        await allure.step("Логирование ошибки 400", async () => {
            await allure.attachment("400 Error Response", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[400 CODE BAD_REQUEST] Некорректный формат запроса (id пакета is null)', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Package Documents");

        await allure.epic("Documents Management");
        await allure.feature("Получение документов пакета");
        await allure.story("Ошибки валидации");

        await allure.severity("high");
        await allure.owner("API Team");
        await allure.tag("validation");
        await allure.tag("null-id");

        await allure.step("Подготовка тестовых данных с null ID", async () => {
            await allure.parameter("Package ID", "null");
            await allure.parameter("Expected Error", "Некорректный формат запроса");
        });

        let response: APIResponse;
        const startTime = Date.now();

        await allure.step("Отправка запроса с null ID пакета", async () => {
            response = await request.get(`${baseUrl}/v1/packages/null/documents`, {
                params: {
                    pageNumber: '0',
                    pageSize: '25'
                },
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        // 1. Базовые проверки
        await allure.step("Базовые проверки ответа", async () => {
            expect(response.status()).toBe(400);
            expect(responseTime, 'Время ответа должно быть меньше 5000ms').toBeLessThan(5000);
            expect(response.headers()['content-type']).toContain('application/json');
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        const responseBody = await response.json();

        await allure.step("Проверка структуры ответа", async () => {
            // 2. Проверка структуры
            expect(responseBody).toBeInstanceOf(Object);
            expect(responseBody).toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');

            // 3. Проверка status
            expect(responseBody.status).toEqual({
                code: "BAD_REQUEST",
                description: "Некорректный формат запроса"
            });

            // 4. Проверка errors
            expect(Array.isArray(responseBody.errors)).toBe(true);
            expect(responseBody.errors).toHaveLength(1);
        });

        await allure.step("Детальная проверка ошибки", async () => {
            const error = responseBody.errors[0];
            expect(error).toHaveProperty('key');
            expect(error).toHaveProperty('code');
            expect(error).toHaveProperty('description');
            expect(error.key).toBe('id');
            expect(error.code).toBe('TYPEMISMATCH');

            // 5. Детальная проверка описания ошибки
            const desc = error.description;
            expect(desc).toContain("Method parameter 'id'");
            expect(desc).toContain("Failed to convert value of type 'java.lang.String'");
            expect(desc).toContain("required type 'java.util.UUID'");
            expect(desc).toContain("Invalid UUID string: null");

            const pattern = /Method parameter 'id': Failed to convert value of type 'java\.lang\.String' to required type 'java\.util\.UUID'; Invalid UUID string: null/;
            expect(desc).toMatch(pattern);

            // 6. Проверка details
            expect(responseBody.details).toBeNull();

            // 7. Дополнительные проверки типов данных
            expect(typeof responseBody.status.code).toBe('string');
            expect(typeof responseBody.status.description).toBe('string');
            expect(typeof error.key).toBe('string');
            expect(typeof error.code).toBe('string');
            expect(typeof error.description).toBe('string');
        });

        await allure.step("Логирование ошибки с null ID", async () => {
            await allure.attachment("400 Error Response (null ID)", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[400 CODE BAD_REQUEST] Некорректный формат запроса (pageNumber <0)', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Package Documents");

        await allure.epic("Documents Management");
        await allure.feature("Получение документов пакета");
        await allure.story("Ошибки валидации параметров");

        await allure.severity("medium");
        await allure.owner("API Team");
        await allure.tag("validation");
        await allure.tag("pagination");

        const packagesId = process.env.PACKAGES_ID || 'your-package-id';

        await allure.step("Подготовка тестовых данных с отрицательным pageNumber", async () => {
            await allure.parameter("Package ID", packagesId);
            await allure.parameter("Page Number", "-1");
            await allure.parameter("Expected Status", "400");
        });

        let response: APIResponse;
        const startTime = Date.now();

        await allure.step("Отправка запроса с отрицательным pageNumber", async () => {
            response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents`, {
                params: {
                    pageNumber: '-1',
                    pageSize: '25'
                },
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 400", async () => {
            expect(response.status()).toBe(400);
        });

        await allure.step("Проверка времени ответа < 6000ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 6000ms').toBeLessThan(6000);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        await allure.step("Проверка Content-Type", async () => {
            expect(response.headers()['content-type']).toBe('application/json');
        });

        const responseBody = await response.json();

        await allure.step("Проверка структуры ответа", async () => {
            expect(responseBody).toHaveProperty('status');
            expect(responseBody.status).toHaveProperty('code');
            expect(responseBody.status).toHaveProperty('description');
            expect(typeof responseBody.status.code).toBe('string');
            expect(typeof responseBody.status.description).toBe('string');
        });

        await allure.step("Логирование ответа с ошибкой", async () => {
            await allure.attachment("500 Error Response", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[422 CODE UNPROCESSABLE_ENTITY] Ошибка валидации (pageSize из 11 цифр)', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Package Documents");

        await allure.epic("Documents Management");
        await allure.feature("Получение документов пакета");
        await allure.story("Ошибки валидации параметров");

        await allure.severity("medium");
        await allure.owner("API Team");
        await allure.tag("validation");
        await allure.tag("pagination");

        const packagesId = process.env.PACKAGES_ID || '019a788b-f2ce-7be1-b143-eec8c1509ebf';

        await allure.step("Подготовка тестовых данных с невалидным pageSize", async () => {
            await allure.parameter("Package ID", packagesId);
            await allure.parameter("Page Size", "10134344044");
            await allure.parameter("Expected Error", "UNPROCESSABLE_ENTITY");
        });

        let response: APIResponse;
        const startTime = Date.now();

        await allure.step("Отправка запроса с невалидным pageSize", async () => {
            response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents`, {
                params: {
                    pageNumber: '0',
                    pageSize: '10134344044'
                },
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 422", async () => {
            expect(response.status()).toBe(422);
        });

        await allure.step("Проверка времени ответа < 2000ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 2000ms').toBeLessThan(2000);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        const responseBody = await response.json();

        await allure.step("Проверка структуры ответа об ошибке", async () => {
            expect(responseBody).toHaveProperty('status');
            expect(responseBody.status).toBeInstanceOf(Object);
            expect(typeof responseBody.status.code).toBe('string');
            expect(typeof responseBody.status.description).toBe('string');

            expect(responseBody).toHaveProperty('errors');
            expect(Array.isArray(responseBody.errors)).toBe(true);
            expect(responseBody.errors.length).toBeGreaterThan(0);
        });

        await allure.step("Проверка структуры каждой ошибки", async () => {
            responseBody.errors.forEach((error: any) => {
                expect(error).toHaveProperty('key');
                expect(error).toHaveProperty('code');
                expect(error).toHaveProperty('description');
                expect(typeof error.key).toBe('string');
                expect(typeof error.code).toBe('string');
                expect(typeof error.description).toBe('string');
            });
        });

        await allure.step("Проверка полной схемы ответа", async () => {
            expect(responseBody).toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');
            expect(responseBody.status).toHaveProperty('code');
            expect(responseBody.status).toHaveProperty('description');

            responseBody.errors.forEach((error: any) => {
                expect(error).toHaveProperty('key');
                expect(error).toHaveProperty('code');
                expect(error).toHaveProperty('description');
            });
        });

        await allure.step("Логирование ошибки валидации", async () => {
            await allure.attachment("422 Validation Error", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });
});