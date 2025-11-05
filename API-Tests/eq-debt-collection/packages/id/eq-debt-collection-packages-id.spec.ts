import { test, expect } from '@playwright/test';

test('Полная валидация описания пакета документов', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/v1/packages/019a113e-58c5-79fe-8672-f4fea9cdc7dd');
    const responseTime = Date.now() - startTime;

    // Test for status code
    expect(response.status(), 'Status code should be 200').toBe(200);

    // Test for response time
    expect(responseTime, `Response time ${responseTime}ms should be less than 200ms`).toBeLessThan(200);

    // Test for response content type
    const contentType = response.headers()['content-type'];
    expect(contentType, 'Content-Type should include application/json').toContain('application/json');

    // Parse response
    const responseData = await response.json();

    // Test for existence of required fields
    const expectedKeys = ['id', 'number', 'typeId', 'statusCode', 'createdAt', 'responsibleLawyerId', 'includedContracts'];
    expectedKeys.forEach(key => {
        expect(responseData, `Response should have property: ${key}`).toHaveProperty(key);
    });

    // Test for data types of fields
    expect(typeof responseData.id, 'id should be a string').toBe('string');
    expect(typeof responseData.number, 'number should be a number').toBe('number');
    expect(typeof responseData.typeId, 'typeId should be a string').toBe('string');
    expect(typeof responseData.statusCode, 'statusCode should be a string').toBe('string');
    expect(typeof responseData.createdAt, 'createdAt should be a string').toBe('string');
    expect(typeof responseData.responsibleLawyerId, 'responsibleLawyerId should be a string').toBe('string');
    expect(Array.isArray(responseData.includedContracts), 'includedContracts should be an array').toBe(true);

    // Test for includedContracts array
    responseData.includedContracts.forEach((contract: any, index: number) => {
        expect(typeof contract, `Contract at index ${index} should be a string`).toBe('string');
    });

    // Additional validation for createdAt field
    expect(responseData.createdAt, 'createdAt field should exist').toBeDefined();
    const createdAtDate = new Date(responseData.createdAt);
    expect(isNaN(createdAtDate.getTime()), 'createdAt should be a valid date').toBe(false);

    // Ensure 'includedContracts' array is not null
    expect(responseData, 'Response should be an object').toBeDefined();
    expect(typeof responseData, 'Response should be an object').toBe('object');
    expect(responseData.includedContracts, 'includedContracts should exist and be an array').toBeDefined();
    expect(Array.isArray(responseData.includedContracts), 'includedContracts should be an array').toBe(true);
    expect(responseData.includedContracts, 'includedContracts should not be null').not.toBeNull();

    // Validate that responsibleLawyerId is either a non-empty string or null
    expect(responseData.responsibleLawyerId, 'responsibleLawyerId should exist').toBeDefined();

    if (typeof responseData.responsibleLawyerId === 'string') {
        expect(responseData.responsibleLawyerId.length, 'responsibleLawyerId should not be empty if it is a string').toBeGreaterThan(0);
    } else {
        expect(responseData.responsibleLawyerId, 'responsibleLawyerId should be null if not a string').toBeNull();
    }
});