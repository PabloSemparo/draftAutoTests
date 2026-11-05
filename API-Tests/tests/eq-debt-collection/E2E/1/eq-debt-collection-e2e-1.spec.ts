import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const baseUrl = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe.serial('API Tests for Document Packages - 1 Copy (Serial)', () => {
    let packagesId: string;

    test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
        await allure.description('Создание пакета документов для районного суда с NEED_FOR_GAS_IS_FALSE и указанным судом');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "a1c067b4-9f2a-400b-a280-c15d48957785",
            contractIds: ["32d01ae5-e8b4-4aa3-ad30-812456990764"]
        };

        const response = await request.post(`${baseUrl}/v1/packages`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: requestBody
        });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        packagesId = responseBody.id;

        await allure.parameter('createdPackagesId', packagesId);
        console.log('Created package ID:', packagesId);
    });

    test('[200 CODE] Документы внутри пакета получены по его ID_1', async ({ request }) => {
        await allure.description('Получение документов внутри созданного пакета по его ID');

        // packagesId доступен из предыдущего теста благодаря test.describe.serial()
        expect(packagesId, 'packagesId должен быть установлен из предыдущего теста').toBeTruthy();

        const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Все остальные проверки из оригинального теста
        expect(responseBody).toHaveProperty('items');
        expect(Array.isArray(responseBody.items)).toBe(true);
        expect(responseBody.items.length).toBeGreaterThan(0);

        if (responseBody.items.length > 0) {
            const firstItem = responseBody.items[0];

            // Проверяем обязательные поля
            expect(firstItem).toHaveProperty('id');
            expect(firstItem).toHaveProperty('packageId');
            expect(firstItem).toHaveProperty('contractId');
            expect(firstItem).toHaveProperty('settingsPackageId');
            expect(firstItem).toHaveProperty('generalType');
            expect(firstItem).toHaveProperty('typeId');
            expect(firstItem).toHaveProperty('status');

            // Проверяем конкретное значение settingsPackageId
            const expectedSettingsPackageId = "28362e06-08be-417c-8c26-4dc17333932e";
            expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);

            // Проверяем UUID формат
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            expect(firstItem.settingsPackageId).toMatch(uuidRegex);
        }
    });
});