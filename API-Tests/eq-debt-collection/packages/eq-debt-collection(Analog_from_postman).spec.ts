// tests/api/create-package-postman.spec.ts
import { test, expect } from '@playwright/test';

test('Пакет документов успешно создан - проверки аналогичные Postman', async ({ request }) => {
    const requestBody = {
        courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
        packageTypeId: "a1c067b4-9f2a-400b-a280-c15d48957785",
        contractIds: ["127ee508-8acb-4993-82be-e01869241c64"]
    };

    const startTime = Date.now();
    const response = await request.post(`v1/packages`, {
        data: requestBody
    });
    const responseTime = Date.now() - startTime;

    // Test for the status code
    expect(response.status()).toBe(201);

    // Test for response time
    expect(responseTime).toBeLessThan(2000);

    // Test for content type
    expect(response.headers()['content-type']).toContain('application/json');

    // Parse the response body
    const responseBody = await response.json();

    // Test for presence of 'id' in response body
    expect(responseBody).toHaveProperty('id');

    // Test for response schema
    expect(typeof responseBody.id).toBe('string');

    // Проверяем, что ответ успешный и содержит JSON
    if (response.status() === 201 && response.headers()['content-type']?.includes('application/json')) {
        const responseData = responseBody;

        // Проверяем наличие id в ответе
        if (responseData.id) {
            // Устанавливаем глобальную переменную (в контексте теста)
            (test.info() as any).packagesId = responseData.id;
            console.log('Package ID set to:', responseData.id);
        } else {
            console.log('No id found in the response');
        }
    } else {
        console.log('Response is not valid JSON or status code is not 201');
    }
});