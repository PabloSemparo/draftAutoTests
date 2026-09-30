import { test, expect } from '@playwright/test';
import { epic, feature, owner, tag, story, severity, description, step, attachment } from 'allure-js-commons';

// Константы и утилиты
const BASE_URL = 'https://eq-debt-collection-stage.bdengi.ru/v1/packages';
const DEFAULT_PARAMS = {
    statusCode: '',
    documentPackageTypeId: '',
    responsibleLawyerId: '',
    number: '',
    pageNumber: '0',
    pageSize: '100'
};

// Вспомогательные функции
const buildUrl = (params = {}) => {
    const queryParams = new URLSearchParams({ ...DEFAULT_PARAMS, ...params });
    return `${BASE_URL}?${queryParams}`;
};

const validateResponseTime = (responseTime, maxTime = 50000) => {
    expect(responseTime, `Response time ${responseTime}ms should be less than ${maxTime}ms`).toBeLessThan(maxTime);
};

const validateItemStructure = (item, index) => {
    const requiredFields = {
        id: 'string',
        number: 'number',
        typeId: 'string',
        statusCode: 'string',
        createdAt: 'string',
        responsibleLawyerId: ['string', 'object'], // string или null
        includedContracts: 'array'
    };

    Object.entries(requiredFields).forEach(([field, expectedType]) => {
        expect(item, `Item ${index} should have ${field}`).toHaveProperty(field);

        if (Array.isArray(expectedType)) {
            expect(expectedType.includes(typeof item[field]),
                `Item ${index} ${field} should be one of: ${expectedType.join(', ')}`).toBe(true);
        } else if (expectedType === 'array') {
            expect(Array.isArray(item[field]),
                `Item ${index} ${field} should be array`).toBe(true);
        } else {
            expect(typeof item[field],
                `Item ${index} ${field} should be ${expectedType}`).toBe(expectedType);
        }
    });

    // Валидация даты
    const createdAtDate = new Date(item.createdAt);
    expect(isNaN(createdAtDate.getTime()),
        `Item ${index} createdAt should be valid date`).toBe(false);
};

const measureResponseTime = async (requestFn) => {
    const startTime = Date.now();
    const response = await requestFn();
    const responseTime = Date.now() - startTime;
    return { response, responseTime };
};

// Альтернативная реализация buildUrl для TypeScript
const buildUrlAlt = (params = {}) => {
    const allParams = { ...DEFAULT_PARAMS, ...params };
    const queryString = Object.entries(allParams)
        .filter(([_, value]) => value !== '') // фильтруем пустые значения
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return `${BASE_URL}${queryString ? '?' + queryString : ''}`;
};

// Основной тестовый класс
test.describe('API Tests - Пакеты документов', () => {
    test.beforeEach(() => {
        epic('EqvaCollection API');
        feature('Проверки получения данных по пакетам');
        owner('API Team');
        tag('package-listing');
        tag('smoke');
    });

    test('Получение списка пакетов с сортировкой по дате создания (DESC)', async ({ request }) => {
        story('Получение списка пакетов');
        severity('critical');
        description('Получение списка пакетов документов с сортировкой по дате создания в порядке убывания');

        const apiUrl = buildUrlAlt(); // используем альтернативную функцию

        await step('Подготовка параметров запроса', async () => {
            await attachment('API URL', apiUrl, 'text/plain');
            await attachment('Query Parameters', JSON.stringify(DEFAULT_PARAMS, null, 2), 'application/json');
        });

        const { response, responseTime } = await measureResponseTime(() => request.get(apiUrl));

        await step('Проверка базовых параметров ответа', async () => {
            expect(response.status(), 'Status code should be 200').toBe(200);
            validateResponseTime(responseTime);

            const contentType = response.headers()['content-type'];
            expect(contentType, 'Content-Type should be application/json').toContain('application/json');

            await attachment('Performance Metrics',
                `Response Time: ${responseTime}ms\nStatus Code: ${response.status()}\nContent-Type: ${contentType}`,
                'text/plain'
            );
        });

        const responseBody = await response.json();
        await attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');

        await step('Проверка структуры ответа', async () => {
            const { items, totalItems, hasMore, pageNumber, pageSize } = responseBody;

            expect(items, 'Response should contain items array').toBeDefined();
            expect(Array.isArray(items), 'Items should be an array').toBe(true);

            // Валидация полей пагинации
            const paginationFields = { totalItems: 'number', hasMore: 'boolean', pageNumber: 'number', pageSize: 'number' };
            Object.entries(paginationFields).forEach(([field, type]) => {
                expect(responseBody[field], `Response should contain ${field}`).toBeDefined();
                expect(typeof responseBody[field], `${field} should be a ${type}`).toBe(type);
            });

            await attachment('Pagination Info',
                `Total Items: ${totalItems}\nHas More: ${hasMore}\nPage Number: ${pageNumber}\nPage Size: ${pageSize}`,
                'text/plain'
            );
        });

        await step('Валидация структуры элементов списка', async () => {
            const { items } = responseBody;

            if (items.length === 0) {
                await attachment('Empty List Info', 'The packages list is empty', 'text/plain');
                return;
            }

            await attachment('First Item Example', JSON.stringify(items[0], null, 2), 'application/json');

            // Параллельная валидация всех элементов
            items.forEach((item, index) => {
                validateItemStructure(item, index);
            });

            await attachment('List Statistics',
                `Total Items in Response: ${items.length}\nFirst Item ID: ${items[0].id}\nFirst Item Status: ${items[0].statusCode}`,
                'text/plain'
            );
        });

        await step('Проверка сортировки по дате создания', async () => {
            const { items } = responseBody;

            if (items.length > 1) {
                const dates = items.map(item => new Date(item.createdAt).getTime());
                const sortedDates = [...dates].sort((a, b) => b - a);

                expect(dates, 'Items should be sorted by createdAt in descending order').toEqual(sortedDates);

                await attachment('Sorting Validation',
                    `First Date: ${new Date(dates[0]).toISOString()}\nLast Date: ${new Date(dates[dates.length - 1]).toISOString()}\nIs Sorted DESC: ${dates.every((date, i) => i === 0 || date <= dates[i - 1])}`,
                    'text/plain'
                );
            }
        });
    });

    test('Фильтрация списка пакетов по documentPackageTypeId', async ({ request }) => {
        story('Фильтрация списка пакетов');
        severity('normal');
        description('Получение списка пакетов с фильтрацией по типу документа');

        const FILTER_PARAMS = {
            statusCode: 'FORMATION',
            documentPackageTypeId: '71bb38da-44ed-491d-ac5b-0452774c67b9',
            pageSize: '25' // теперь строка
        };

        const filteredUrl = buildUrlAlt(FILTER_PARAMS);

        await step('Подготовка параметров запроса с фильтрацией', async () => {
            await attachment('Filtered API URL', filteredUrl, 'text/plain');
            await attachment('Filter Parameters', JSON.stringify(FILTER_PARAMS, null, 2), 'application/json');
        });

        const { response, responseTime } = await measureResponseTime(() => request.get(filteredUrl));

        await step('Проверка ответа с фильтрацией', async () => {
            expect(response.status()).toBe(200);
            validateResponseTime(responseTime, 1000);

            const responseBody = await response.json();
            await attachment('Filtered Response', JSON.stringify(responseBody, null, 2), 'application/json');

            if (responseBody.items && responseBody.items.length > 0) {
                const targetTypeId = FILTER_PARAMS.documentPackageTypeId;
                const allMatchType = responseBody.items.every(item => item.typeId === targetTypeId);

                expect(allMatchType, 'All items should have the filtered typeId').toBe(true);

                await attachment('Filter Validation',
                    `Filtered by typeId: ${targetTypeId}\nItems Count: ${responseBody.items.length}\nAll Match Filter: ${allMatchType}`,
                    'text/plain'
                );
            }
        });
    });
});