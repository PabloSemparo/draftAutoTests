import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('Создание пакетов документов', () => {

    test.beforeEach(() => {
        allure.epic('EqvaCollection API');
        allure.feature('Создание пакетов');
        allure.owner('API Team');
        allure.tag('package-creation');
    });

    test('[201 CODE] Пакет документов успешно создан (Тестовый_NEED_FOR_GAS_IS_FALSE (DISTRICT) Суд указан)', async ({ request }) => {
        allure.story('DISTRICT тип с указанным судом');
        allure.severity('critical');
        allure.description('Создание пакета DISTRICT типа с указанным судом и NEED_FOR_GAS = FALSE');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "a1c067b4-9f2a-400b-a280-c15d48957785",
            contractIds: ["127ee508-8acb-4993-82be-e01869241c64"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
            allure.attachment('Request Headers', JSON.stringify({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'Host': 'eq-debt-collection-stage.bdengi.ru',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            // 1. Status code is 201
            expect(response!.status(), 'Status code should be 201').toBe(201);

            // 2. Response time is less than 5000ms
            expect(responseTime, `Response time ${responseTime}ms should be less than 5000ms`).toBeLessThan(5000);

            // 3. Content-Type is application/json
            const contentType = response!.headers()['content-type'];
            expect(contentType, 'Content-Type should be application/json').toContain('application/json');

            // 4. Response body contains id
            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id, 'Response body should contain id').toBeDefined();
            expect(typeof responseData.id, 'ID should be a string').toBe('string');
            expect(responseData.id.length, 'ID should not be empty').toBeGreaterThan(0);

            allure.attachment('Performance Metrics',
                `Response Time: ${responseTime}ms\nStatus Code: 201\nPackage ID: ${responseData.id}`,
                'text/plain'
            );
        });
    });

    test('[201 CODE] Пакет документов успешно создан (Тестовый_NEED_FOR_GAS_IS_FALSE (DISTRICT) Дефолтный)', async ({ request }) => {
        allure.story('DISTRICT тип дефолтный');
        allure.severity('critical');
        allure.description('Создание пакета DISTRICT типа с дефолтными настройками и NEED_FOR_GAS = FALSE');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "a1c067b4-9f2a-400b-a280-c15d48957785",
            contractIds: ["000090ee-c2f9-41d7-a223-e6a97b95768c"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            expect(response!.status()).toBe(201);
            expect(responseTime).toBeLessThan(5000);

            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id).toBeDefined();
            expect(typeof responseData.id).toBe('string');
            expect(responseData.id.length).toBeGreaterThan(0);
        });
    });

    test('[201 CODE] Пакет документов успешно создан (Тестовый_NEED_FOR_GAS_IS_FALSE (MAGISTRATE) Суд указан)', async ({ request }) => {
        allure.story('MAGISTRATE тип с указанным судом');
        allure.severity('critical');
        allure.description('Создание пакета MAGISTRATE типа с указанным судом и NEED_FOR_GAS = FALSE');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "893592f1-e26a-4d96-a230-66767c26e77a",
            contractIds: ["00004a4d-358e-46e5-8ac5-33a4956f33b0"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            expect(response!.status()).toBe(201);
            expect(responseTime).toBeLessThan(5000);

            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id).toBeDefined();
            expect(typeof responseData.id).toBe('string');
            expect(responseData.id.length).toBeGreaterThan(0);
        });
    });

    test('[201 CODE] Пакет документов успешно создан (Тестовый_NEED_FOR_GAS_IS_FALSE (MAGISTRATE) Дефолтный)', async ({ request }) => {
        allure.story('MAGISTRATE тип дефолтный');
        allure.severity('critical');
        allure.description('Создание пакета MAGISTRATE типа с дефолтными настройками и NEED_FOR_GAS = FALSE');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "893592f1-e26a-4d96-a230-66767c26e77a",
            contractIds: ["000090ee-c2f9-41d7-a223-e6a97b95768c"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            expect(response!.status()).toBe(201);
            expect(responseTime).toBeLessThan(5000);

            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id).toBeDefined();
            expect(typeof responseData.id).toBe('string');
            expect(responseData.id.length).toBeGreaterThan(0);
        });
    });

    test('[201 CODE] Пакет документов успешно создан (Районный суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE) Суд указан)', async ({ request }) => {
        allure.story('Районный суд ФЭ с указанным судом');
        allure.severity('critical');
        allure.description('Создание пакета для районного суда ФЭ на печать с NEED_FOR_GAS = TRUE и указанным судом');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "7be90c4b-487a-4366-9af4-35c1d8f7c937",
            contractIds: ["5077f0d5-dc9d-48bb-bcfa-f579ccf78c35"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            expect(response!.status()).toBe(201);
            expect(responseTime).toBeLessThan(5000);

            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id).toBeDefined();
            expect(typeof responseData.id).toBe('string');
            expect(responseData.id.length).toBeGreaterThan(0);
        });
    });

    test('[201 CODE] Пакет документов успешно создан (Районный суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE) Дефолтный)', async ({ request }) => {
        allure.story('Районный суд ФЭ дефолтный');
        allure.severity('critical');
        allure.description('Создание пакета для районного суда ФЭ на печать с NEED_FOR_GAS = TRUE и дефолтными настройками');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "7be90c4b-487a-4366-9af4-35c1d8f7c937",
            contractIds: ["127ee508-8acb-4993-82be-e01869241c64"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            expect(response!.status()).toBe(201);
            expect(responseTime).toBeLessThan(5000);

            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id).toBeDefined();
            expect(typeof responseData.id).toBe('string');
            expect(responseData.id.length).toBeGreaterThan(0);
        });
    });

    test('[201 CODE] Пакет документов успешно создан (Мировой суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE) Суд указан)', async ({ request }) => {
        allure.story('Мировой суд ФЭ с указанным судом');
        allure.severity('critical');
        allure.description('Создание пакета для мирового суда ФЭ на печать с NEED_FOR_GAS = TRUE и указанным судом');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "a7d7af33-a42d-4a66-bb8a-40eb9c1bd21c",
            contractIds: ["00004a4d-358e-46e5-8ac5-33a4956f33b0"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            expect(response!.status()).toBe(201);
            expect(responseTime).toBeLessThan(5000);

            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id).toBeDefined();
            expect(typeof responseData.id).toBe('string');
            expect(responseData.id.length).toBeGreaterThan(0);
        });
    });

    test('[201 CODE] Пакет документов успешно создан (Мировой суд ФЭ на печать_NEED_FOR_GAS_IS_TRUE) Дефолтный)', async ({ request }) => {
        allure.story('Мировой суд ФЭ дефолтный');
        allure.severity('critical');
        allure.description('Создание пакета для мирового суда ФЭ на печать с NEED_FOR_GAS = TRUE и дефолтными настройками');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "a7d7af33-a42d-4a66-bb8a-40eb9c1bd21c",
            contractIds: ["0000cf37-d804-4fe7-a725-58fa4567bfb4"]
        };

        await allure.step('Подготовка тестовых данных', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса /v1/packages', async () => {
            response = await request.post('v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Host': 'eq-debt-collection-stage.bdengi.ru',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация успешного ответа', async () => {
            expect(response!.status()).toBe(201);
            expect(responseTime).toBeLessThan(5000);

            const responseData = await response!.json();
            allure.attachment('Response Body', JSON.stringify(responseData, null, 2), 'application/json');

            expect(responseData.id).toBeDefined();
            expect(typeof responseData.id).toBe('string');
            expect(responseData.id.length).toBeGreaterThan(0);
        });
    });

    test('[404 CODE] Не найдены контракты', async ({ request }) => {
        allure.story('Обработка ошибок');
        allure.severity('normal');
        allure.description('Тестирование обработки ситуации когда контракты не найдены');
        allure.tag('negative');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "893592f1-e26a-4d96-a230-66767c26e77a",
            contractIds: [
                "06246991-37b4-42e9-8869-ee8265f6bdd5",
                "b5b0256a-f654-4fd1-bb3d-b2e84a8611d2",
                "0f607876-11db-48fc-ad7a-fa54e62dbc3b"
            ]
        };

        await allure.step('Подготовка тестовых данных с невалидными контрактами', async () => {
            allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
        });

        const startTime = Date.now();

        let response;
        await allure.step('Отправка POST запроса с невалидными контрактами', async () => {
            response = await request.post('/v1/packages', {
                data: requestBody
            });
        });

        const responseTime = Date.now() - startTime;

        await allure.step('Валидация ошибки 404', async () => {
            // 1. Status code is 404
            expect(response!.status()).toBe(404);

            // 2. Response time is less than 2000ms
            expect(responseTime).toBeLessThan(2000);

            // 3. Response content type is application/json
            expect(response!.headers()['content-type']).toContain('application/json');

            // Получаем данные ответа
            const responseData = await response!.json();
            allure.attachment('Error Response', JSON.stringify(responseData, null, 2), 'application/json');

            // 4. Response has status object
            expect(responseData.status).toBeDefined();
            expect(responseData.status).toHaveProperty('code');
            expect(responseData.status).toHaveProperty('description');

            // 5. Response has errors array
            expect(responseData.errors).toBeDefined();
            expect(Array.isArray(responseData.errors)).toBe(true);
            expect(responseData.errors.length).toBeGreaterThan(0);

            // Проверка каждой ошибки в массиве
            responseData.errors.forEach((error: any, index: number) => {
                expect(error).toHaveProperty('key');
                expect(error).toHaveProperty('code');
                expect(error).toHaveProperty('description');

                // Дополнительные проверки для большей надежности
                expect(typeof error.key).toBe('string');
                expect(typeof error.code).toBe('string');
                expect(typeof error.description).toBe('string');
                expect(error.key.length).toBeGreaterThan(0);
                expect(error.code.length).toBeGreaterThan(0);
                expect(error.description.length).toBeGreaterThan(0);
            });

            allure.attachment('Error Details',
                `Response Time: ${responseTime}ms\nStatus Code: 404\nErrors Count: ${responseData.errors.length}`,
                'text/plain'
            );
        });
    });
});