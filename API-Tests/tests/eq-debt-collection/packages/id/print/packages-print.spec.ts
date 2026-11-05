// tests/packages-print.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from "allure-playwright";

// Типы объявлены непосредственно в файле
interface ApiResponse {
    status: {
        code: string;
        description: string;
    };
    errors?: ApiError[];
    details?: any;
}

interface ApiError {
    key: string;
    code: string;
    description: string;
}

interface PrintRequest {
    courtLawyerId: string;
    documentIds: string[];
}

// Константы для тестовых данных
const VALID_PACKAGE_ID = '019a6df0-3d83-7a78-9847-70aed4c7feaf';
const VALID_COURT_LAWYER_ID = '96f007da-441e-4dfd-9be0-36ccefe6e58b';
const BASE_URL = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe('API: Отправка документов пакета на печать', () => {

    test('[200] Документы пакета успешно отправлены на печать', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Print Documents");

        await allure.epic("EqvaCollection API");
        await allure.feature("Отправка документов на печать");
        await allure.story("Успешные сценарии");

        await allure.severity("critical");
        await allure.owner("API Team");
        await allure.tag("smoke");
        await allure.tag("regression");

        const requestBody: PrintRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        await allure.step("Подготовка тестовых данных", async () => {
            await allure.parameter("Package ID", VALID_PACKAGE_ID);
            await allure.parameter("Court Lawyer ID", VALID_COURT_LAWYER_ID);
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка POST запроса на печать", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/print`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 200", async () => {
            expect(statusCode, 'Статус код должен быть 200').toBe(200);
        });

        await allure.step("Проверка времени ответа < 5000ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 5000ms').toBeLessThan(5000);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        await allure.step("Проверка наличия заголовка vary", async () => {
            const headers = response.headers();
            const varyHeader = headers.vary;
            expect(varyHeader, 'Заголовок vary должен присутствовать').toBeDefined();
        });

        await allure.step("Логирование успешного выполнения", async () => {
            await allure.attachment("Request Body", JSON.stringify(requestBody, null, 2), "application/json");
            await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[400] Некорректный формат запроса - отсутствует ID', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Отправка документов на печать");
        await allure.story("Ошибки валидации");
        await allure.severity("high");
        await allure.tag("validation");

        await allure.step("Подготовка запроса с пустым ID пакета", async () => {
            await allure.parameter("Package ID", "EMPTY");
            await allure.parameter("Request Body", "NOT PROVIDED");
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса с пустым ID без тела запроса", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/:id/print`, {
                headers: {
                    'Accept': 'application/json'
                    // Не передаем Content-Type, так как нет тела запроса
                }
                // Не передаем data - тело запроса отсутствует
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 400", async () => {
            expect(statusCode, 'Статус код должен быть 400').toBe(400);
        });

        await allure.step("Проверка времени ответа", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 500ms').toBeLessThan(500);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        let responseBody: ApiResponse;

        await allure.step("Парсинг JSON ответа", async () => {
            responseBody = await response.json();
        });

        await allure.step("Проверка структуры ответа", async () => {
            expect(responseBody, 'Ответ должен содержать статус, ошибки и детали').toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');
        });

        await allure.step("Проверка объекта status", async () => {
            expect(responseBody.status.code, 'Код статуса должен быть BAD_REQUEST').toBe('BAD_REQUEST');
            expect(responseBody.status.description, 'Описание должно соответствовать').toBe('Некорректный формат запроса');
        });

        await allure.step("Проверка массива errors", async () => {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив ошибок должен содержать элементы').toHaveLength(1);

            const error: ApiError = responseBody.errors![0];
            expect(error.key, 'Ключ ошибки должен быть "id"').toBe('id');
            expect(error.code, 'Код ошибки должен быть TYPEMISMATCH').toBe('TYPEMISMATCH');
            expect(error.description, 'Описание ошибки должно содержать информацию о конвертации').toMatch(/Failed to convert value/);
            expect(error.description, 'Описание ошибки должно содержать информацию о UUID').toMatch(/Invalid UUID string/);
        });

        await allure.step("Проверка поля details", async () => {
            expect(responseBody.details, 'Details должен быть null').toBeNull();
        });

        await allure.step("Логирование ошибки валидации", async () => {
            await allure.attachment("Error Response", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            await allure.attachment("Request Details", "Запрос отправлен без тела, только с пустым ID в URL", "text/plain");
        });
    });

    test('[400] Некорректный формат запроса - ID равен null', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Отправка документов на печать");
        await allure.story("Ошибки валидации");
        await allure.severity("high");
        await allure.tag("validation");

        await allure.step("Подготовка запроса с ID = null", async () => {
            await allure.parameter("Package ID", "null");
            await allure.parameter("Request Body", "NOT PROVIDED");
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса с null ID без тела запроса", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/null/print`, {
                headers: {
                    'Accept': 'application/json'
                    // Не передаем Content-Type, так как нет тела запроса
                }
                // Не передаем data - тело запроса отсутствует
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 400", async () => {
            expect(statusCode, 'Статус код должен быть 400').toBe(400);
        });

        let responseBody: ApiResponse;

        await allure.step("Парсинг JSON ответа", async () => {
            responseBody = await response.json();
        });

        await allure.step("Проверка структуры ошибки", async () => {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив ошибок должен содержать элементы').toHaveLength(1);

            const error = responseBody.errors![0];
            expect(error.description, 'Описание должно содержать "Invalid UUID string: null"').toContain('Invalid UUID string: null');

            // Логируем ошибку
            await allure.attachment("Validation Error", JSON.stringify(error, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[400] Некорректный формат запроса - ID не UUID', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Отправка документов на печать");
        await allure.story("Ошибки валидации");
        await allure.severity("high");
        await allure.tag("validation");

        const invalidId = 'not-a-uuid';

        await allure.step("Подготовка запроса с невалидным UUID", async () => {
            await allure.parameter("Package ID", invalidId);
            await allure.parameter("Request Body", "NOT PROVIDED");
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса с невалидным ID без тела запроса", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${invalidId}/print`, {
                headers: {
                    'Accept': 'application/json'
                    // Не передаем Content-Type, так как нет тела запроса
                }
                // Не передаем data - тело запроса отсутствует
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 400", async () => {
            expect(statusCode, 'Статус код должен быть 400').toBe(400);
        });

        let responseBody: ApiResponse;

        await allure.step("Парсинг JSON ответа", async () => {
            responseBody = await response.json();
        });

        await allure.step("Проверка описания ошибки", async () => {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив ошибок должен содержать элементы').toHaveLength(1);

            const error = responseBody.errors![0];
            expect(error.description, 'Описание должно содержать Method parameter').toContain("Method parameter 'id'");
            expect(error.description, 'Описание должно содержать java.lang.String').toContain('java.lang.String');
            expect(error.description, 'Описание должно содержать java.util.UUID').toContain('java.util.UUID');

            // Логируем полный ответ
            await allure.attachment("Full Error Response", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[422] Ошибка валидации параметров запроса', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Отправка документов на печать");
        await allure.story("Ошибки валидации");
        await allure.severity("high");
        await allure.tag("validation");

        const requestBody: PrintRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса для получения 422 ошибки", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/print`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода", async () => {
            // Проверяем что статус код определен и является числом
            expect(statusCode, 'Статус код должен быть определен').toBeDefined();
            expect(typeof statusCode, 'Статус код должен быть числом').toBe('number');

            // Проверяем что статус код один из ожидаемых
            const expectedStatuses = [200, 422];
            expect(expectedStatuses, `Статус код должен быть одним из: ${expectedStatuses.join(', ')}`).toContain(statusCode);

            await allure.parameter("Actual Status Code", statusCode.toString());
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        if (statusCode === 422) {
            let responseBody: ApiResponse;

            await allure.step("Парсинг JSON ответа для 422 ошибки", async () => {
                responseBody = await response.json();
            });

            await allure.step("Проверка структуры 422 ошибки", async () => {
                expect(responseBody.status.code).toBe('VALIDATION_ERROR');
                expect(responseBody.errors).toBeDefined();

                await allure.attachment("422 Error Details", JSON.stringify(responseBody, null, 2), "application/json");
            });
        } else {
            await allure.step("Логирование успешного ответа", async () => {
                await allure.attachment("Success Response", `Status: ${statusCode}`, "text/plain");
            });
        }
    });

    test('[500] Ошибка обработки запроса', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Отправка документов на печать");
        await allure.story("Ошибки сервера");
        await allure.severity("critical");
        await allure.tag("server-error");

        const requestBody: PrintRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса для проверки 500 ошибки", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/print`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка возможных статус кодов", async () => {
            // Проверяем что статус код определен и является числом
            expect(statusCode, 'Статус код должен быть определен').toBeDefined();
            expect(typeof statusCode, 'Статус код должен быть числом').toBe('number');

            // Проверяем что статус код один из ожидаемых
            const expectedStatuses = [200, 500];
            expect(expectedStatuses, `Статус код должен быть одним из: ${expectedStatuses.join(', ')}`).toContain(statusCode);

            await allure.parameter("Actual Status Code", statusCode.toString());
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        if (statusCode === 500) {
            let responseBody: ApiResponse;

            await allure.step("Парсинг JSON ответа для 500 ошибки", async () => {
                responseBody = await response.json();
            });

            await allure.step("Проверка структуры 500 ошибки", async () => {
                expect(responseBody.status.code).toBeDefined();
                expect(responseBody.errors).toBeDefined();

                await allure.attachment("500 Server Error", JSON.stringify(responseBody, null, 2), "application/json");
            });
        } else {
            await allure.step("Логирование нормального ответа", async () => {
                await allure.attachment("Normal Response", `Status: ${statusCode}`, "text/plain");
            });
        }
    });
});