import { test, expect, APIResponse } from '@playwright/test';
import { allure } from "allure-playwright";

const baseUrl = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe('API: Контракты и документы для ГАС', () => {

    test.describe('v1/contracts/{id} [Получить описание последнего пакета созданного для контракта]', () => {

        test('[200 CODE] Описание получено', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Contracts API");
            await allure.subSuite("Get Last Package");

            await allure.epic("Contracts Management");
            await allure.feature("Получение пакетов контракта");
            await allure.story("Успешное получение последнего пакета");

            await allure.severity("critical");
            await allure.owner("API Team");
            await allure.tag("smoke");
            await allure.tag("contracts");

            const contractId = '00004a4d-358e-46e5-8ac5-33a4956f33b0';

            await allure.step("Подготовка тестовых данных", async () => {
                await allure.parameter("Contract ID", contractId);
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка GET запроса для получения последнего пакета контракта", async () => {
                response = await request.get(`${baseUrl}/v1/contracts/${contractId}/packages`, {
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

            await allure.step("Проверка Content-Type", async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType, 'Content-Type должен быть application/json').toBe('application/json');
            });

            const responseBody = await response.json();

            await allure.step("Проверка обязательных свойств в ответе", async () => {
                expect(responseBody, 'Ответ должен содержать все обязательные свойства').toHaveProperty('id');
                expect(responseBody).toHaveProperty('number');
                expect(responseBody).toHaveProperty('typeId');
                expect(responseBody).toHaveProperty('statusCode');
                expect(responseBody).toHaveProperty('createdAt');
                expect(responseBody).toHaveProperty('responsibleLawyerId');
                expect(responseBody).toHaveProperty('includedContracts');
            });

            await allure.step("Проверка что includedContracts является массивом", async () => {
                expect(Array.isArray(responseBody.includedContracts), 'includedContracts должен быть массивом').toBe(true);
            });

            await allure.step("Логирование успешного выполнения", async () => {
                await allure.attachment("Response Body", JSON.stringify(responseBody, null, 2), "application/json");
                await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            });
        });
    });

    test.describe('v1/contracts/{id}/documents/gas [Получить документы подготовленные для ГАС из последнего пакета созданного для контракта]', () => {

        test('[200 CODE] Документы получены', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Contracts API");
            await allure.subSuite("Get GAS Documents");

            await allure.epic("Contracts Management");
            await allure.feature("Получение документов ГАС контракта");
            await allure.story("Успешное получение документов ГАС");

            await allure.severity("critical");
            await allure.owner("API Team");
            await allure.tag("smoke");
            await allure.tag("gas");
            await allure.tag("contracts");

            const contractId = '0000cf37-d804-4fe7-a725-58fa4567bfb4';

            await allure.step("Подготовка тестовых данных", async () => {
                await allure.parameter("Contract ID", contractId);
                await allure.parameter("Page Number", "1");
                await allure.parameter("Page Size", "25");
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка GET запроса для получения документов ГАС контракта", async () => {
                response = await request.get(`${baseUrl}/v1/contracts/${contractId}/documents/gas`, {
                    params: {
                        pageNumber: '1',
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

            await allure.step("Проверка времени ответа < 200ms", async () => {
                expect(responseTime, 'Время ответа должно быть меньше 200ms').toBeLessThan(200);
                await allure.parameter("Response Time", `${responseTime}ms`);
            });

            await allure.step("Проверка Content-Type", async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
            });

            const responseBody = await response.json();

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

            await allure.step("Логирование успешного выполнения", async () => {
                await allure.attachment("Response Body", JSON.stringify(responseBody, null, 2), "application/json");
                await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            });
        });
    });

    test.describe('v1/contracts/{id}/documents/gas [Получить идентификаторы файлов документов подготовленных для ГАС из последнего пакета созданного для контракта]', () => {

        test('[200 CODE] Идентификаторы получены', async ({ request }) => {
            await allure.parentSuite("API Tests");
            await allure.suite("Contracts API");
            await allure.subSuite("Get GAS File IDs");

            await allure.epic("Contracts Management");
            await allure.feature("Получение идентификаторов файлов ГАС контракта");
            await allure.story("Успешное получение идентификаторов файлов");

            await allure.severity("critical");
            await allure.owner("API Team");
            await allure.tag("smoke");
            await allure.tag("gas");
            await allure.tag("contracts");

            const contractId = '00004a4d-358e-46e5-8ac5-33a4956f33b0';

            await allure.step("Подготовка тестовых данных", async () => {
                await allure.parameter("Contract ID", contractId);
            });

            let response: APIResponse;
            const startTime = Date.now();

            await allure.step("Отправка GET запроса для получения идентификаторов файлов ГАС", async () => {
                response = await request.get(`${baseUrl}/v1/contracts/${contractId}/documents/gas/files/ids`, {
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

            await allure.step("Проверка времени ответа < 200ms", async () => {
                expect(responseTime, 'Время ответа должно быть меньше 200ms').toBeLessThan(200);
                await allure.parameter("Response Time", `${responseTime}ms`);
            });

            const responseBody = await response.json();

            await allure.step("Проверка что тело ответа является массивом", async () => {
                expect(Array.isArray(responseBody), 'Тело ответа должно быть массивом').toBe(true);
            });

            await allure.step("Проверка Content-Type", async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
            });

            await allure.step("Логирование успешного выполнения", async () => {
                await allure.attachment("Response Body", JSON.stringify(responseBody, null, 2), "application/json");
                await allure.attachment("Response Headers", JSON.stringify(response.headers(), null, 2), "application/json");
                await allure.attachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
            });
        });
    });
});