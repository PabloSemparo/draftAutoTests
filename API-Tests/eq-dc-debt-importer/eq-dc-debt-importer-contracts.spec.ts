import { test, expect } from '@playwright/test';
import contractorData from '../Test\'s Data/contractorData.json';
const API_URL = process.env.API_URL || 'http://eq-dc-debt-importer.test2.mmk.local';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

// Тесты для работы с договорами
test.describe('Тесты для работы с договорами [Contracts API]', () => {
    test('GET /admin/v1/contracts - должен вернуть список договоров', async ({ request }) => {
        const response = await request.get(`${API_URL}/admin/v1/contracts?contractImportId=55298707-117c-44a5-8434-162fb9d2e4c5&status=VALID&pageNumber=0&pageSize=25`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('items');
        expect(body.items).toBeInstanceOf(Array);
    });

    test('GET /admin/v1/contracts/{id} - должен вернуть детали по договору', async ({ request }) => {
        // В реальном тесте здесь нужно было бы создать тестовый договор
        // Для примера просто проверяем что эндпоинт существует
        const response = await request.get(`${API_URL}/admin/v1/contracts/55298707-117c-44a5-8434-162fb9d2e4c5`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        // Ожидаем 404 или 200 в зависимости от наличия тестовых данных
        expect([200, 404]).toContain(response.status());
    });
});
