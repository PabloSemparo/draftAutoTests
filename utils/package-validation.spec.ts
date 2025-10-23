import { test, expect } from '@playwright/test';
import { PackageAssertions } from './package-assertions';

test.describe('Валидация ответов пакетов документов', () => {

    test('Полная валидация ответа пакета', async ({ request }) => {
        const response = await request.get('/v1/packages/123');

        const { responseData, responseTime } = await PackageAssertions.validatePackageResponse(response, {
            maxResponseTime: 200
        });

        // Дополнительные специфичные проверки
        expect(responseData.id).toMatch(/^[a-f0-9-]+$/); // UUID format
        expect(responseData.statusCode).toMatch(/^[A-Z_]+$/); // UPPER_CASE format
    });

    test('Валидация с пустым includedContracts', async ({ request }) => {
        const response = await request.get('/v1/packages/empty-contracts');

        const { responseData } = await PackageAssertions.validatePackageResponse(response);

        // Дополнительная проверка на пустой массив
        expect(responseData.includedContracts).toEqual([]);
    });

    test('Валидация с null responsibleLawyerId', async ({ request }) => {
        const response = await request.get('/v1/packages/null-lawyer');

        const { responseData } = await PackageAssertions.validatePackageResponse(response);

        // Специфичная проверка для null значения
        expect(responseData.responsibleLawyerId).toBeNull();
    });
});