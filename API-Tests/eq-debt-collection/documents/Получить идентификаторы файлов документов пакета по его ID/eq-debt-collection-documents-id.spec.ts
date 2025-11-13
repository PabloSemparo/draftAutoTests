import { test, expect, APIResponse } from '@playwright/test';
import { allure } from "allure-playwright";

const baseUrl = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe('Получить идентификаторы файлов документов пакета по его ID', () => {

    test('[200 CODE] Идентификаторы успешно получены', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Document File IDs");

        await allure.epic("Documents Management");
        await allure.feature("Получение идентификаторов файлов документов");
        await allure.story("Успешное получение идентификаторов");

        await allure.severity("critical");
        await allure.owner("API Team");
        await allure.tag("smoke");
        await allure.tag("regression");

        const packagesId = process.env.PACKAGES_ID || '019a788b-f2ce-7be1-b143-eec8c1509ebf';

        await allure.step("Подготовка тестовых данных", async () => {
            await allure.parameter("Package ID", packagesId);
        });

        let response: APIResponse;
        const startTime = Date.now();

        await allure.step("Отправка GET запроса для получения идентификаторов файлов", async () => {
            response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents/files/ids`, {
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

        await allure.step("Проверка времени ответа < 500ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 500ms').toBeLessThan(500);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        await allure.step("Проверка Content-Type", async () => {
            const contentType = response.headers()['content-type'];
            expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
        });

        const responseBody = await response.json();

        await allure.step("Проверка что ответ является массивом", async () => {
            expect(Array.isArray(responseBody), 'Ответ должен быть массивом').toBe(true);
        });

        await allure.step("Проверка что массив не пустой", async () => {
            expect(responseBody.length, 'Массив не должен быть пустым').toBeGreaterThan(0);
        });

        await allure.step("Проверка каждого элемента массива", async () => {
            responseBody.forEach((uuid: string, index: number) => {
                // Проверка, что элемент является строкой
                expect(typeof uuid, `Элемент #${index + 1} должен быть строкой`).toBe('string');

                // Проверка формата UUID
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                expect(uuid, `Элемент #${index + 1} должен быть валидным UUID`).toMatch(uuidRegex);

                // Проверка длины UUID
                expect(uuid.length, `Элемент #${index + 1} должен иметь длину 36 символов`).toBe(36);
            });
        });

        await allure.step("Извлечение и сохранение первого UUID", async () => {
            // Check if response is an array and has at least one element
            if (Array.isArray(responseBody) && responseBody.length > 0) {
                // Get the first value from the array
                const firstValue = responseBody[0];

                // Set environment variable
                process.env.FIRST_UUID = firstValue;

                // Verify the operation was successful
                expect(process.env.FIRST_UUID).toBe(firstValue);
                await allure.parameter("First UUID", firstValue);
            } else {
                throw new Error('Response is not a valid array or is empty');
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
        await allure.subSuite("Get Document File IDs");

        await allure.epic("Documents Management");
        await allure.feature("Получение идентификаторов файлов документов");
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
            response = await request.get(`${baseUrl}/v1/packages/:id/documents/files/ids`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 400", async () => {
            expect(statusCode, 'Статус код должен быть 400').toBe(400);
        });

        await allure.step("Проверка времени ответа < 5000ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 5000ms').toBeLessThan(5000);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        await allure.step("Проверка заголовка Content-Type", async () => {
            const contentType = response.headers()['content-type'];
            expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
        });

        const responseBody = await response.json();

        await allure.step("Проверка общей структуры ответа", async () => {
            expect(responseBody, 'Ответ должен быть объектом').toBeInstanceOf(Object);
            expect(responseBody, 'Ответ должен содержать status, errors и details').toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');
        });

        await allure.step("Проверка объекта status", async () => {
            expect(responseBody.status, 'Status должен быть объектом').toBeInstanceOf(Object);
            expect(responseBody.status, 'Status должен содержать code и description').toHaveProperty('code');
            expect(responseBody.status).toHaveProperty('description');
            expect(responseBody.status.code, 'Код статуса должен быть BAD_REQUEST').toBe('BAD_REQUEST');
            expect(responseBody.status.description, 'Описание должно соответствовать').toBe('Некорректный формат запроса');
        });

        await allure.step("Проверка массива errors", async () => {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив errors должен содержать 1 элемент').toHaveLength(1);
        });

        await allure.step("Проверка структуры ошибки", async () => {
            const error = responseBody.errors[0];
            expect(error, 'Ошибка должна быть объектом').toBeInstanceOf(Object);
            expect(error, 'Ошибка должна содержать key, code и description').toHaveProperty('key');
            expect(error).toHaveProperty('code');
            expect(error).toHaveProperty('description');
            expect(error.key, 'Ключ ошибки должен быть id').toBe('id');
            expect(error.code, 'Код ошибки должен быть TYPEMISMATCH').toBe('TYPEMISMATCH');

            // Проверка описания ошибки
            const expectedDescriptionParts = [
                "Method parameter 'id'",
                "Failed to convert value of type 'java.lang.String'",
                "required type 'java.util.UUID'",
                "Invalid UUID string: :id"
            ];

            expectedDescriptionParts.forEach(part => {
                expect(error.description, `Описание ошибки должно содержать: ${part}`).toContain(part);
            });
        });

        await allure.step("Проверка поля details", async () => {
            expect(responseBody.details, 'Details должен быть null').toBeNull();
        });

        await allure.step("Дополнительные проверки с регулярным выражением", async () => {
            const error = responseBody.errors[0];
            const pattern = /Method parameter 'id': Failed to convert value of type 'java\.lang\.String' to required type 'java\.util\.UUID'; Invalid UUID string: :id/;
            expect(error.description, 'Описание ошибки должно соответствовать паттерну').toMatch(pattern);
            expect(error.description, 'Описание ошибки должно упоминать UUID').toMatch(/java\.util\.UUID/);
        });

        await allure.step("Логирование ошибки 400", async () => {
            await allure.attachment("400 Error Response", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[400 CODE BAD_REQUEST] Некорректный формат запроса (id пакета is null)', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Document File IDs");

        await allure.epic("Documents Management");
        await allure.feature("Получение идентификаторов файлов документов");
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
            response = await request.get(`${baseUrl}/v1/packages/null/documents/files/ids`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Базовые проверки ответа", async () => {
            expect(statusCode, 'Статус код должен быть 400').toBe(400);
            expect(responseTime, 'Время ответа должно быть меньше 5000ms').toBeLessThan(5000);

            const contentType = response.headers()['content-type'];
            expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');

            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        const responseBody = await response.json();

        await allure.step("Проверка структуры ответа", async () => {
            expect(responseBody, 'Ответ должен быть объектом').toBeInstanceOf(Object);
            expect(responseBody, 'Ответ должен содержать status, errors и details').toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');

            // Проверка status
            expect(responseBody.status, 'Status должен соответствовать ожидаемой структуре').toEqual({
                code: "BAD_REQUEST",
                description: "Некорректный формат запроса"
            });

            // Проверка errors
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив errors должен содержать 1 элемент').toHaveLength(1);
        });

        await allure.step("Детальная проверка ошибки", async () => {
            const error = responseBody.errors[0];
            expect(error, 'Ошибка должна содержать key, code и description').toHaveProperty('key');
            expect(error).toHaveProperty('code');
            expect(error).toHaveProperty('description');
            expect(error.key, 'Ключ ошибки должен быть id').toBe('id');
            expect(error.code, 'Код ошибки должен быть TYPEMISMATCH').toBe('TYPEMISMATCH');

            // Детальная проверка описания ошибки
            const desc = error.description;
            expect(desc, 'Описание ошибки должно содержать Method parameter').toContain("Method parameter 'id'");
            expect(desc, 'Описание ошибки должно содержать Failed to convert').toContain("Failed to convert value of type 'java.lang.String'");
            expect(desc, 'Описание ошибки должно содержать required type').toContain("required type 'java.util.UUID'");
            expect(desc, 'Описание ошибки должно содержать Invalid UUID string').toContain("Invalid UUID string: null");

            const pattern = /Method parameter 'id': Failed to convert value of type 'java\.lang\.String' to required type 'java\.util\.UUID'; Invalid UUID string: null/;
            expect(desc, 'Описание ошибки должно соответствовать паттерну').toMatch(pattern);

            // Проверка details
            expect(responseBody.details, 'Details должен быть null').toBeNull();

            // Дополнительные проверки типов данных
            expect(typeof responseBody.status.code, 'Status code должен быть строкой').toBe('string');
            expect(typeof responseBody.status.description, 'Status description должен быть строкой').toBe('string');
            expect(typeof error.key, 'Error key должен быть строкой').toBe('string');
            expect(typeof error.code, 'Error code должен быть строкой').toBe('string');
            expect(typeof error.description, 'Error description должен быть строкой').toBe('string');
        });

        await allure.step("Логирование ошибки с null ID", async () => {
            await allure.attachment("400 Error Response (null ID)", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[400 CODE BAD_REQUEST] Некорректный формат запроса (Передан id пакета не формата UUID)', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Get Document File IDs");

        await allure.epic("Documents Management");
        await allure.feature("Получение идентификаторов файлов документов");
        await allure.story("Ошибки валидации");

        await allure.severity("high");
        await allure.owner("API Team");
        await allure.tag("validation");
        await allure.tag("invalid-uuid");

        const invalidPackageId = "3434343443";

        await allure.step("Подготовка тестовых данных с невалидным UUID", async () => {
            await allure.parameter("Package ID", invalidPackageId);
            await allure.parameter("Expected Error", "Некорректный формат запроса");
        });

        let response: APIResponse;
        const startTime = Date.now();

        await allure.step("Отправка запроса с невалидным ID пакета", async () => {
            response = await request.get(`${baseUrl}/v1/packages/${invalidPackageId}/documents/files/ids`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Базовые проверки ответа", async () => {
            expect(statusCode, 'Статус код должен быть 400').toBe(400);
            expect(responseTime, 'Время ответа должно быть меньше 500ms').toBeLessThan(500);

            const contentType = response.headers()['content-type'];
            expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');

            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        const responseBody = await response.json();

        await allure.step("Проверка структуры ответа", async () => {
            expect(responseBody, 'Ответ должен быть объектом').toBeInstanceOf(Object);
            expect(responseBody, 'Ответ должен содержать status, errors и details').toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');

            // Проверка status
            expect(responseBody.status, 'Status должен соответствовать ожидаемой структуре').toEqual({
                code: "BAD_REQUEST",
                description: "Некорректный формат запроса"
            });

            // Проверка errors
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив errors должен содержать 1 элемент').toHaveLength(1);
        });

        await allure.step("Детальная проверка ошибки", async () => {
            const error = responseBody.errors[0];
            expect(error, 'Ошибка должна содержать key, code и description').toHaveProperty('key');
            expect(error).toHaveProperty('code');
            expect(error).toHaveProperty('description');
            expect(error.key, 'Ключ ошибки должен быть id').toBe('id');
            expect(error.code, 'Код ошибки должен быть TYPEMISMATCH').toBe('TYPEMISMATCH');

            // Детальная проверка описания ошибки
            const desc = error.description;
            expect(desc, 'Описание ошибки должно содержать Method parameter').toContain("Method parameter 'id'");
            expect(desc, 'Описание ошибки должно содержать Failed to convert').toContain("Failed to convert value of type 'java.lang.String'");
            expect(desc, 'Описание ошибки должно содержать required type').toContain("required type 'java.util.UUID'");
            expect(desc, 'Описание ошибки должно содержать Invalid UUID string').toContain("Invalid UUID string: 3434343443");

            const pattern = /Method parameter 'id': Failed to convert value of type 'java\.lang\.String' to required type 'java\.util\.UUID'; Invalid UUID string: 3434343443/;
            expect(desc, 'Описание ошибки должно соответствовать паттерну').toMatch(pattern);

            // Проверка details
            expect(responseBody.details, 'Details должен быть null').toBeNull();

            // Дополнительные проверки типов данных
            expect(typeof responseBody.status.code, 'Status code должен быть строкой').toBe('string');
            expect(typeof responseBody.status.description, 'Status description должен быть строкой').toBe('string');
            expect(typeof error.key, 'Error key должен быть строкой').toBe('string');
            expect(typeof error.code, 'Error code должен быть строкой').toBe('string');
            expect(typeof error.description, 'Error description должен быть строкой').toBe('string');
        });

        await allure.step("Логирование ошибки с невалидным UUID", async () => {
            await allure.attachment("400 Error Response (invalid UUID)", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });
});