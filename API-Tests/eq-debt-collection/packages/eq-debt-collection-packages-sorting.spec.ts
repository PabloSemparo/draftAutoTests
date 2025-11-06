import { test, expect } from '@playwright/test';
import { epic, feature, owner, tag, story, severity, description, step, attachment } from 'allure-js-commons';

test.describe('Описание пакетов API Tests', () => {
    const API_URL = 'https://eq-debt-collection-stage.bdengi.ru/v1/packages?statusCode=&documentPackageTypeId=&responsibleLawyerId=&number=&pageNumber=0&pageSize=100';

    test.beforeEach(() => {
        epic('EqvaCollection API');
        feature('Проверки получения данных по пакетам');
        owner('API Team');
        tag('package-listing');
        tag('smoke');
    });

    test('Список, отсортированный по дате создания desc', async ({ request }) => {
        story('Получение списка пакетов');
        severity('critical');
        description('Получение списка пакетов документов с сортировкой по дате создания в порядке убывания');

        await step('Подготовка параметров запроса', async () => {
            await attachment('API URL', API_URL, 'text/plain');
            await attachment('Query Parameters', JSON.stringify({
                statusCode: '',
                documentPackageTypeId: '',
                responsibleLawyerId: '',
                number: '',
                pageNumber: 0,
                pageSize: 100
            }, null, 2), 'application/json');
        });

        // Send API request and measure time
        const startTime = Date.now();

        let response;
        await step('Отправка GET запроса для получения списка пакетов', async () => {
            response = await request.get(API_URL);
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        await step('Проверка базовых параметров ответа', async () => {
            // Test for status code
            expect(response!.status(), 'Status code should be 200').toBe(200);

            // Test for response time
            expect(responseTime, `Response time ${responseTime}ms should be less than 50000ms`).toBeLessThan(50000);

            // Test for Content-Type header
            const contentType = response!.headers()['content-type'];
            expect(contentType, 'Content-Type should be application/json').toContain('application/json');

            await attachment('Performance Metrics',
                `Response Time: ${responseTime}ms\nStatus Code: ${response!.status()}\nContent-Type: ${contentType}`,
                'text/plain'
            );
        });

        // Parse response JSON
        const responseBody = await response!.json();

        await step('Прикрепление данных ответа', async () => {
            await attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
        });

        await step('Проверка структуры ответа', async () => {
            // Test for items array
            expect(responseBody.items, 'Response should contain items array').toBeDefined();
            expect(Array.isArray(responseBody.items), 'Items should be an array').toBe(true);

            // Test for totalItems
            expect(responseBody.totalItems, 'Response should contain totalItems').toBeDefined();
            expect(typeof responseBody.totalItems, 'totalItems should be a number').toBe('number');

            // Test for hasMore
            expect(responseBody.hasMore, 'Response should contain hasMore').toBeDefined();
            expect(typeof responseBody.hasMore, 'hasMore should be a boolean').toBe('boolean');

            // Test for pagination fields
            expect(responseBody.pageNumber, 'Response should contain pageNumber').toBeDefined();
            expect(typeof responseBody.pageNumber, 'pageNumber should be a number').toBe('number');

            expect(responseBody.pageSize, 'Response should contain pageSize').toBeDefined();
            expect(typeof responseBody.pageSize, 'pageSize should be a number').toBe('number');

            await attachment('Pagination Info',
                `Total Items: ${responseBody.totalItems}\nHas More: ${responseBody.hasMore}\nPage Number: ${responseBody.pageNumber}\nPage Size: ${responseBody.pageSize}`,
                'text/plain'
            );
        });

        await step('Валидация структуры элементов списка', async () => {
            if (responseBody.items && responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];
                await attachment('First Item Example', JSON.stringify(firstItem, null, 2), 'application/json');

                for (const [index, item] of responseBody.items.entries()) {
                    await step(`Проверка элемента ${index + 1}`, async () => {
                        expect(item, `Item ${index} should have id`).toHaveProperty('id');
                        expect(item, `Item ${index} should have number`).toHaveProperty('number');
                        expect(item, `Item ${index} should have typeId`).toHaveProperty('typeId');
                        expect(item, `Item ${index} should have statusCode`).toHaveProperty('statusCode');
                        expect(item, `Item ${index} should have createdAt`).toHaveProperty('createdAt');
                        expect(item, `Item ${index} should have responsibleLawyerId`).toHaveProperty('responsibleLawyerId');
                        expect(item, `Item ${index} should have includedContracts`).toHaveProperty('includedContracts');

                        // Проверка типов данных
                        expect(typeof item.id, `Item ${index} id should be string`).toBe('string');
                        expect(typeof item.number, `Item ${index} number should be number`).toBe('number');
                        expect(typeof item.typeId, `Item ${index} typeId should be string`).toBe('string');
                        expect(typeof item.statusCode, `Item ${index} statusCode should be string`).toBe('string');
                        expect(typeof item.createdAt, `Item ${index} createdAt should be string`).toBe('string');
                        expect(['string', 'object'].includes(typeof item.responsibleLawyerId), `Item ${index} responsibleLawyerId should be string or null`).toBe(true);
                        expect(Array.isArray(item.includedContracts), `Item ${index} includedContracts should be array`).toBe(true);

                        // Дополнительные проверки для createdAt
                        const createdAtDate = new Date(item.createdAt);
                        expect(isNaN(createdAtDate.getTime()), `Item ${index} createdAt should be valid date`).toBe(false);
                    });
                }

                await attachment('List Statistics',
                    `Total Items in Response: ${responseBody.items.length}\nFirst Item ID: ${firstItem.id}\nFirst Item Status: ${firstItem.statusCode}`,
                    'text/plain'
                );
            } else {
                await step('Проверка пустого списка', async () => {
                    await attachment('Empty List Info', 'The packages list is empty', 'text/plain');
                    expect(responseBody.items.length, 'Items array should be empty').toBe(0);
                });
            }
        });

        await step('Проверка сортировки по дате создания', async () => {
            if (responseBody.items && responseBody.items.length > 1) {
                const dates = responseBody.items.map((item: any) => new Date(item.createdAt).getTime());
                const sortedDates = [...dates].sort((a, b) => b - a); // DESC order

                expect(dates, 'Items should be sorted by createdAt in descending order').toEqual(sortedDates);

                await attachment('Sorting Validation',
                    `First Date: ${new Date(dates[0]).toISOString()}\nLast Date: ${new Date(dates[dates.length - 1]).toISOString()}\nIs Sorted DESC: ${JSON.stringify(dates.every((date, i) => i === 0 || date <= dates[i - 1]))}`,
                    'text/plain'
                );
            }
        });
    });

    test('Список с фильтрацией по documentPackageTypeId', async ({ request }) => {
        story('Фильтрация списка пакетов');
        severity('normal');
        description('Получение списка пакетов с фильтрацией по типу документа');

        const filteredUrl = 'https://eq-debt-collection-stage.bdengi.ru/v1/packages?statusCode=FORMATION&documentPackageTypeId=71bb38da-44ed-491d-ac5b-0452774c67b9&responsibleLawyerId=&number=&pageNumber=0&pageSize=25';

        await step('Подготовка параметров запроса с фильтрацией', async () => {
            await attachment('Filtered API URL', filteredUrl, 'text/plain');
        });

        const startTime = Date.now();

        let response;
        await step('Отправка GET запроса с фильтрацией', async () => {
            response = await request.get(filteredUrl);
        });

        const responseTime = Date.now() - startTime;

        await step('Проверка ответа с фильтрацией', async () => {
            expect(response!.status()).toBe(200);
            expect(responseTime).toBeLessThan(1000);

            const responseBody = await response!.json();
            await attachment('Filtered Response', JSON.stringify(responseBody, null, 2), 'application/json');

            // Проверка что все элементы имеют нужный typeId
            if (responseBody.items && responseBody.items.length > 0) {
                const targetTypeId = '71bb38da-44ed-491d-ac5b-0452774c67b9';
                const allMatchType = responseBody.items.every((item: any) => item.typeId === targetTypeId);

                expect(allMatchType, 'All items should have the filtered typeId').toBe(true);

                await attachment('Filter Validation',
                    `Filtered by typeId: ${targetTypeId}\nItems Count: ${responseBody.items.length}\nAll Match Filter: ${allMatchType}`,
                    'text/plain'
                );
            }
        });
    });
});