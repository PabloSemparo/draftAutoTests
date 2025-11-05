import { test, expect } from '@playwright/test';
import { assertIsObject, assertIsStringOrNull, assertIsValidDate } from '../../../../utils/custom-matchers';

test('Валидация с кастомными хелперами', async ({ request }) => {
    const response = await request.get('/v1/packages/019a113e-58c5-79fe-8672-f4fea9cdc7dd');

    expect(response.status()).toBe(200);

    const responseData = await response.json();

    // Используем кастомные хелперы
    assertIsObject(responseData, 'Response should be a valid object');
    assertIsValidDate(responseData.createdAt, 'createdAt should be a valid date');

    // Проверка responsibleLawyerId
    assertIsStringOrNull(responseData.responsibleLawyerId, 'responsibleLawyerId should be string or null');

    // Стандартные проверки
    expect(typeof responseData.id).toBe('string');
    expect(typeof responseData.number).toBe('number');
    expect(typeof responseData.typeId).toBe('string');
    expect(typeof responseData.statusCode).toBe('string');
    expect(Array.isArray(responseData.includedContracts)).toBe(true);
    expect(responseData.includedContracts).not.toBeNull();

    // Проверка элементов массива
    responseData.includedContracts.forEach((contract: any, index: number) => {
        expect(typeof contract).toBe('string');
    });
});