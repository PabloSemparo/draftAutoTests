import { test, expect, APIResponse } from '@playwright/test';
import { allure } from "allure-playwright";

const baseUrl = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe('API: Документы пакета для ГАС и управление документами', () => {

    test.describe('/gas [Получить документы пакета подготовленные для ГАС по его ID]', () => {

        test('[200 CODE] Документы получены', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Packages API");
            await allure.subSuite("GAS Documents");

            await allure.epic("GAS Integration");
            await allure.feature("Получение документов для ГАС");
            await allure.story("Успешное получение документов ГАС");

            await allure.severity("critical");
            await allure.owner("API Team");
            await allure.tag("smoke");
            await allure.tag("gas");

            const packagesId = process.env.PACKAGES_ID || '019a788b-f2ce-7be1-b143-eec8c1509ebf';

            await allure.step("Подготовка тестовых данных", async () => {
                await allure.parameter("Package ID", packagesId);
                await allure.parameter("Page Number", "0");
                await allure.parameter("Page Size", "25");
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка GET запроса для получения документов ГАС", async () => {
                response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents/gas`, {
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

            await allure.step("Проверка статус кода 200", async () => {
                expect(statusCode, 'Статус код должен быть 200').toBe(200);
            });

            await allure.step("Проверка времени ответа < 1000ms", async () => {
                expect(responseTime, 'Время ответа должно быть меньше 1000ms').toBeLessThan(1000);
                await allure.parameter("Response Time", `${responseTime}ms`);
            });

            await allure.step("Проверка Content-Type", async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
            });

            const responseBody = await response.json();

            await allure.step("Проверка существования и структуры массива items", async () => {
                expect(responseBody.items, 'Items должен существовать').toBeDefined();
                expect(Array.isArray(responseBody.items), 'Items должен быть массивом').toBe(true);
                expect(responseBody.items.length, 'Items массив не должен быть пустым').toBeGreaterThan(0);
            });

            await allure.step("Проверка обязательных свойств в каждом элементе", async () => {
                if (responseBody.items && responseBody.items.length > 0) {
                    responseBody.items.forEach((item: any, index: number) => {
                        expect(item, `Элемент #${index + 1} должен содержать все обязательные свойства`).toHaveProperty('id');
                        expect(item).toHaveProperty('packageId');
                        expect(item).toHaveProperty('contractId');
                        expect(item).toHaveProperty('settingsPackageId');
                        expect(item).toHaveProperty('generalType');
                        expect(item).toHaveProperty('typeId');
                        expect(item).toHaveProperty('fileId');
                        expect(item).toHaveProperty('fullFileName');
                        expect(item).toHaveProperty('createdAt');
                        expect(item).toHaveProperty('status');

                        // Дополнительные проверки типов для критических полей
                        expect(typeof item.id, `ID элемента #${index + 1} должен быть строкой`).toBe('string');
                        expect(item.createdAt, `createdAt элемента #${index + 1} должен быть валидной датой`).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
                    });
                }
            });

            let firstItemId: string | null = null;

            await allure.step("Извлечение и сохранение первого ID документа", async () => {
                // Check if response has items array and it's not empty
                if (responseBody && responseBody.items && Array.isArray(responseBody.items) && responseBody.items.length > 0) {
                    // Get the first id from the items array
                    firstItemId = responseBody.items[0].id;

                    // Set environment variable for use in other tests
                    process.env.FIRST_ITEM_ID = firstItemId;

                    // Verify the operation was successful
                    expect(process.env.FIRST_ITEM_ID, 'FIRST_ITEM_ID должен быть установлен').toBe(firstItemId);

                    await allure.parameter("First Item ID", firstItemId);
                    await allure.attachment("First Item ID", firstItemId, "text/plain");

                    console.log("First item ID set to environment variable:", firstItemId);
                } else {
                    throw new Error('Response does not contain valid items array or array is empty');
                }
            });

            await allure.step("Логирование успешного выполнения", async () => {
                await allure.attachment("Response Body", JSON.stringify(responseBody, null, 2), "application/json");
                await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
                await allure.attachment("First Item Details", JSON.stringify(responseBody.items[0], null, 2), "application/json");
            });
        });

        test('[400 CODE] Некорректный формат запроса', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Packages API");
            await allure.subSuite("GAS Documents");

            await allure.epic("GAS Integration");
            await allure.feature("Получение документов для ГАС");
            await allure.story("Ошибки валидации");

            await allure.severity("high");
            await allure.owner("API Team");
            await allure.tag("validation");
            await allure.tag("gas");

            await allure.step("Подготовка тестовых данных для 400 ошибки", async () => {
                await allure.parameter("Package ID", "не передан");
                await allure.parameter("Page Size", "30");
                await allure.parameter("Expected Error", "BAD_REQUEST");
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка запроса без ID пакета", async () => {
                response = await request.get(`${baseUrl}/v1/packages/:id/documents/gas`, {
                    params: {
                        pageNumber: '0',
                        pageSize: '30'
                    },
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

            await allure.step("Проверка времени ответа < 7000ms", async () => {
                expect(responseTime, 'Время ответа должно быть меньше 7000ms').toBeLessThan(7000);
                await allure.parameter("Response Time", `${responseTime}ms`);
            });

            const responseBody = await response.json();

            await allure.step("Проверка наличия свойства status", async () => {
                expect(responseBody, 'Ответ должен содержать свойство status').toHaveProperty('status');
            });

            await allure.step("Проверка кода статуса BAD_REQUEST", async () => {
                expect(responseBody.status.code, 'Код статуса должен быть BAD_REQUEST').toBe("BAD_REQUEST");
            });

            await allure.step("Проверка массива errors", async () => {
                expect(responseBody, 'Ответ должен содержать массив errors').toHaveProperty('errors');
                expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
                expect(responseBody.errors.length, 'Массив errors не должен быть пустым').toBeGreaterThan(0);
            });

            await allure.step("Проверка структуры каждой ошибки", async () => {
                responseBody.errors.forEach((error: any) => {
                    expect(error, 'Каждая ошибка должна содержать key, code и description').toHaveProperty('key');
                    expect(error).toHaveProperty('code');
                    expect(error).toHaveProperty('description');
                });
            });

            await allure.step("Проверка схемы ответа", async () => {
                expect(responseBody, 'Ответ должен содержать status, errors и details').toHaveProperty('status');
                expect(responseBody).toHaveProperty('errors');
                expect(responseBody).toHaveProperty('details');
                expect(responseBody.status, 'Status должен содержать code и description').toHaveProperty('code');
                expect(responseBody.status).toHaveProperty('description');

                responseBody.errors.forEach((error: any) => {
                    expect(error, 'Каждая ошибка должна содержать key, code и description').toHaveProperty('key');
                    expect(error).toHaveProperty('code');
                    expect(error).toHaveProperty('description');
                });
            });

            await allure.step("Логирование ошибки 400", async () => {
                await allure.attachment("400 Error Response", JSON.stringify(responseBody, null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            });
        });
    });

    test.describe('/gas [Получить идентификаторы файлов документов пакета подготовленных для ГАС по его ID]', () => {

        test('Получить идентификаторы файлов документов пакета подготовленных для ГАС по его ID', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Packages API");
            await allure.subSuite("GAS File IDs");

            await allure.epic("GAS Integration");
            await allure.feature("Получение идентификаторов файлов ГАС");
            await allure.story("Успешное получение идентификаторов файлов");

            await allure.severity("critical");
            await allure.owner("API Team");
            await allure.tag("smoke");
            await allure.tag("gas");

            const packagesId = process.env.PACKAGES_ID || '019a788b-f2ce-7be1-b143-eec8c1509ebf';

            await allure.step("Подготовка тестовых данных", async () => {
                await allure.parameter("Package ID", packagesId);
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка GET запроса для получения идентификаторов файлов ГАС", async () => {
                response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents/gas/files/ids`, {
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

            await allure.step("Проверка что тело ответа является массивом", async () => {
                expect(Array.isArray(responseBody), 'Тело ответа должно быть массивом').toBe(true);
            });

            await allure.step("Проверка Content-Type", async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType, 'Content-Type должен быть application/json').toBe('application/json');
            });

            await allure.step("Проверка схемы ответа", async () => {
                responseBody.forEach((id: any) => {
                    expect(typeof id, 'Каждый идентификатор должен быть строкой').toBe('string');
                });
            });

            await allure.step("Логирование успешного выполнения", async () => {
                await allure.attachment("Response Body", JSON.stringify(responseBody, null, 2), "application/json");
                await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            });
        });
    });

    test.describe('/{documentId} Обновить идентификатор файла для документа внутри пакета', () => {

        test('[200 CODE] Идентификатор файла обновлен', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Packages API");
            await allure.subSuite("Update Document File");

            await allure.epic("Document Management");
            await allure.feature("Обновление идентификатора файла документа");
            await allure.story("Успешное обновление идентификатора файла");

            await allure.severity("high");
            await allure.owner("API Team");
            await allure.tag("update");
            await allure.tag("document");

            const packagesId = process.env.PACKAGES_ID || '019a788b-f2ce-7be1-b143-eec8c1509ebf';
            const documentId = '01990ede-1ac8-705a-9c4c-2fe9204b6021';

            const requestBody = {
                fileId: "3fa85f24-5717-4562-b3fc-2c963f66afa6",
                fullFilename: "ExtendedDebtStatement.xlsx"
            };

            await allure.step("Подготовка тестовых данных", async () => {
                await allure.parameter("Package ID", packagesId);
                await allure.parameter("Document ID", documentId);
                await allure.parameter("File ID", requestBody.fileId);
                await allure.parameter("Full Filename", requestBody.fullFilename);
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка POST запроса для обновления идентификатора файла", async () => {
                response = await request.post(`${baseUrl}/v1/packages/${packagesId}/documents/${documentId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: requestBody
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

            await allure.step("Логирование успешного выполнения", async () => {
                await allure.attachment("Request Body", JSON.stringify(requestBody, null, 2), "application/json");
                await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            });
        });
    });

    test.describe('/{documentId} Исключить документ из пакета документов', () => {

        test('[200 CODE] документ успешно удален', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Packages API");
            await allure.subSuite("Delete Document");

            await allure.epic("Document Management");
            await allure.feature("Удаление документа из пакета");
            await allure.story("Успешное удаление документа");

            await allure.severity("high");
            await allure.owner("API Team");
            await allure.tag("delete");
            await allure.tag("document");

            const packagesId = process.env.PACKAGES_ID || '019a788b-f2ce-7be1-b143-eec8c1509ebf';
            const firstItemId = process.env.FIRST_ITEM_ID || '019a788b-f32d-7556-bf51-63a816485820';

            await allure.step("Подготовка тестовых данных", async () => {
                await allure.parameter("Package ID", packagesId);
                await allure.parameter("Document ID", firstItemId);
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка DELETE запроса для удаления документа", async () => {
                response = await request.delete(`${baseUrl}/v1/packages/${packagesId}/documents/${firstItemId}`, {
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

            await allure.step("Логирование успешного выполнения", async () => {
                await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            });
        });
    });
});