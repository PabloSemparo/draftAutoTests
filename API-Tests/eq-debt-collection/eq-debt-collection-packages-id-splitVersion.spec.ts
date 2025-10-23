import { test, expect } from '@playwright/test';

test.describe('Детальная валидация ответа пакета', () => {
    let responseData: any;

    test.beforeEach(async ({ request }) => {
        const response = await request.get('/v1/packages/019a113e-58c5-79fe-8672-f4fea9cdc7dd');
        expect(response.status()).toBe(200);
        responseData = await response.json();
    });

    test('Response has all required fields', async () => {
        const expectedKeys = ['id', 'number', 'typeId', 'statusCode', 'createdAt', 'responsibleLawyerId', 'includedContracts'];
        expectedKeys.forEach(key => {
            expect(responseData).toHaveProperty(key);
        });
    });

    test('All fields have correct data types', async () => {
        expect(typeof responseData.id).toBe('string');
        expect(typeof responseData.number).toBe('number');
        expect(typeof responseData.typeId).toBe('string');
        expect(typeof responseData.statusCode).toBe('string');
        expect(typeof responseData.createdAt).toBe('string');

        // Для responsibleLawyerId проверяем что это либо строка, либо null
        if (responseData.responsibleLawyerId !== null) {
            expect(typeof responseData.responsibleLawyerId).toBe('string');
        }

        expect(Array.isArray(responseData.includedContracts)).toBe(true);
    });

    test('The createdAt field must be in a valid date format', async () => {
        expect(responseData).toHaveProperty('createdAt');
        const createdAtDate = new Date(responseData.createdAt);
        expect(isNaN(createdAtDate.getTime())).toBe(false);
    });

    test('Ensure includedContracts array is not null', async () => {
        expect(responseData).toBeDefined();
        expect(typeof responseData).toBe('object');
        expect(responseData.includedContracts).toBeDefined();
        expect(Array.isArray(responseData.includedContracts)).toBe(true);
        expect(responseData.includedContracts).not.toBeNull();
    });

    test('Validate that responsibleLawyerId is either a non-empty string or null', async () => {
        expect(responseData).toHaveProperty('responsibleLawyerId');

        if (typeof responseData.responsibleLawyerId === 'string') {
            expect(responseData.responsibleLawyerId.length).toBeGreaterThan(0);
        } else {
            expect(responseData.responsibleLawyerId).toBeNull();
        }
    });

    test('All includedContracts items are strings', async () => {
        responseData.includedContracts.forEach((contract: any, index: number) => {
            expect(typeof contract, `Contract at index ${index} should be a string`).toBe('string');
        });
    });
});