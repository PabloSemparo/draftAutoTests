import { test, expect } from '@playwright/test';

// Базовые настройки
const API_URL = process.env.API_URL || 'http://eq-dc-debt-importer.test2.mmk.local';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

// Тесты для работы с импортом договоров
test.describe('Contract Imports API', () => {
    test('GET /admin/v1/contract-imports - Возвращаем список импортов', async ({ request }) => {
        const response = await request.get(`${API_URL}/admin/v1/contract-imports?contractorId=55298707-117c-44a5-8434-162fb9d2e4c5&status=DRAFT&pageNumber=0&pageSize=25`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('items');
        expect(body.items).toBeInstanceOf(Array);
    });

    test('GET /admin/v1/contract-imports/{id} - Возвращаем детали импорта [200 CODE]', async ({ request }) => {
        const response = await request.get(`${API_URL}/admin/v1/contract-imports?contractorId=55298707-117c-44a5-8434-162fb9d2e4c5&status=DRAFT&pageNumber=0&pageSize=25`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
    });
});

// Тесты безопасности
test.describe('Security tests', () => {
    test('Ошибка авторизации [401 CODE]', async ({ request }) => {
        const response = await request.get(`${API_URL}/admin/v1/contractors`);
        expect(response.status()).toBe(401);
    });
});
