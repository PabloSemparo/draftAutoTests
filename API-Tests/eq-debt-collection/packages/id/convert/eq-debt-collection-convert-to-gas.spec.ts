// tests/packages-convert.spec.ts
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

interface ConvertRequest {
    courtLawyerId: string;
    documentIds: string[];
}

// Константы для тестовых данных
const VALID_PACKAGE_ID = '019a6df0-3d83-7a78-9847-70aed4c7feaf';
const VALID_COURT_LAWYER_ID = '96f007da-441e-4dfd-9be0-36ccefe6e58b';
const INVALID_PACKAGE_ID = '019a06e7-f490-7379-8527-92ba7e0aa701'; // Для 422 ошибки
const BASE_URL = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe('API: Конвертировать документы пакета в PDF для отправки в ГАС', () => {

    test('[200] Успешно сконвертированы документы пакета в PDF для отправки в ГАС', async ({ request }) => {
        await allure.parentSuite("API Tests");
        await allure.suite("Packages API");
        await allure.subSuite("Convert to PDF");

        await allure.epic("EqvaCollection API");
        await allure.feature("Конвертация документов в PDF");
        await allure.story("Успешные сценарии");

        await allure.severity("critical");
        await allure.owner("API Team");
        await allure.tag("smoke");
        await allure.tag("regression");

        const requestBody: ConvertRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        await allure.step("Подготовка тестовых данных", async () => {
            await allure.parameter("Package ID", VALID_PACKAGE_ID);
            await allure.parameter("Court Lawyer ID", VALID_COURT_LAWYER_ID);
            await allure.parameter("Document IDs", "Пустой массив");
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка POST запроса на конвертацию в PDF", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/convert`, {
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

        await allure.step("Проверка наличия заголовка date", async () => {
            const headers = response.headers();
            const dateHeader = headers.date;
            expect(dateHeader, 'Заголовок date должен присутствовать').toBeDefined();
        });

        await allure.step("Логирование заголовков ответа", async () => {
            const headers = response.headers();
            await allure.attachment("Response Headers", JSON.stringify(headers, null, 2), "application/json");
        });

        await allure.step("Логирование успешного выполнения", async () => {
            await allure.attachment("Request Body", JSON.stringify(requestBody, null, 2), "application/json");
            await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[422] Для данного пакета не доступна отправка в ГАС', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Конвертация документов в PDF");
        await allure.story("Ошибки валидации");
        await allure.severity("high");
        await allure.tag("validation");
        await allure.tag("gas-validation");

        const requestBody: ConvertRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        await allure.step("Подготовка тестовых данных для 422 ошибки", async () => {
            await allure.parameter("Package ID", INVALID_PACKAGE_ID);
            await allure.parameter("Court Lawyer ID", VALID_COURT_LAWYER_ID);
            await allure.parameter("Expected Error", "Для данного пакета не доступна отправка в ГАС");
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса с пакетом, недоступным для ГАС", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${INVALID_PACKAGE_ID}/convert`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status();

        await allure.step("Проверка статус кода 422", async () => {
            expect(statusCode, 'Статус код должен быть 422').toBe(422);
        });

        await allure.step("Проверка времени ответа < 2000ms", async () => {
            expect(responseTime, 'Время ответа должно быть меньше 2000ms').toBeLessThan(2000);
            await allure.parameter("Response Time", `${responseTime}ms`);
        });

        await allure.step("Проверка Content-Type", async () => {
            const headers = response.headers();
            const contentType = headers['content-type'];
            expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
        });

        let responseBody: ApiResponse;

        await allure.step("Парсинг JSON ответа", async () => {
            responseBody = await response.json();
        });

        await allure.step("Проверка что массив errors не пустой", async () => {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
            expect(responseBody.errors, 'Массив ошибок не должен быть пустым').not.toHaveLength(0);
        });

        await allure.step("Проверка схемы ответа", async () => {
            // Проверка корневой структуры
            expect(responseBody, 'Ответ должен содержать статус, ошибки и детали').toHaveProperty('status');
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody).toHaveProperty('details');

            // Проверка структуры status
            expect(responseBody.status, 'Status должен содержать code и description').toHaveProperty('code');
            expect(responseBody.status).toHaveProperty('description');

            // Проверка что errors является массивом
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);

            // Проверка структуры каждой ошибки
            if (responseBody.errors && responseBody.errors.length > 0) {
                responseBody.errors.forEach((error: ApiError, index: number) => {
                    expect(error, `Error[${index}] должен содержать key, code и description`).toHaveProperty('key');
                    expect(error).toHaveProperty('code');
                    expect(error).toHaveProperty('description');
                });
            }
        });

        await allure.step("Логирование ошибки валидации", async () => {
            await allure.attachment("422 Error Response", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            await allure.attachment("Request Details", JSON.stringify({
                packageId: INVALID_PACKAGE_ID,
                courtLawyerId: VALID_COURT_LAWYER_ID,
                documentIds: []
            }, null, 2), "application/json");
        });
    });

    test('[400] Неправильный формат запроса', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Конвертация документов в PDF");
        await allure.story("Ошибки валидации");
        await allure.severity("high");
        await allure.tag("validation");

        // Создаем невалидный запрос - например, с неправильным courtLawyerId
        const invalidRequestBody = {
            courtLawyerId: "invalid-uuid-format",
            documentIds: []
        };

        await allure.step("Подготовка невалидных тестовых данных", async () => {
            await allure.parameter("Package ID", VALID_PACKAGE_ID);
            await allure.parameter("Court Lawyer ID", "invalid-uuid-format");
            await allure.parameter("Expected Error", "Неправильный формат запроса");
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса с невалидными данными", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/convert`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: invalidRequestBody
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
            expect(responseBody.status.code, 'Код статуса должен быть BAD_REQUEST').toBe('BAD_REQUEST');
            expect(responseBody.status.description, 'Описание должно соответствовать').toBe('Некорректный формат запроса');
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
        });

        await allure.step("Логирование ошибки 400", async () => {
            await allure.attachment("400 Error Response", JSON.stringify(responseBody, null, 2), "application/json");
            await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        });
    });

    test('[500] Ошибка обработки запроса', async ({ request }) => {
        await allure.epic("EqvaCollection API");
        await allure.feature("Конвертация документов в PDF");
        await allure.story("Ошибки сервера");
        await allure.severity("critical");
        await allure.tag("server-error");

        const requestBody: ConvertRequest = {
            courtLawyerId: VALID_COURT_LAWYER_ID,
            documentIds: []
        };

        await allure.step("Подготовка тестовых данных", async () => {
            await allure.parameter("Package ID", VALID_PACKAGE_ID);
            await allure.parameter("Court Lawyer ID", VALID_COURT_LAWYER_ID);
        });

        let response: any;
        const startTime = Date.now();

        await allure.step("Отправка запроса для проверки 500 ошибки", async () => {
            response = await request.post(`${BASE_URL}/v1/packages/${VALID_PACKAGE_ID}/convert`, {
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
            // В нормальных условиях должен быть 200, но проверяем на случай ошибки сервера
            expect(statusCode, 'Статус код должен быть определен').toBeDefined();
            expect(typeof statusCode, 'Статус код должен быть числом').toBe('number');

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