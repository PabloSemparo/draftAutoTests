import { test, expect } from '@playwright/test';
import { AllureDecorators } from '../../utils/allure-decorators';
import { envValidator } from '../../utils/env-validator';

envValidator.validate();
const baseUrl = envValidator.getEnv('BASE_URL');

test.describe('API Пакетов Документов', () => {

    test.beforeEach(() => {
        AllureDecorators.epic('EqvaCollection API');
        AllureDecorators.feature('Создание пакета документом');
        AllureDecorators.owner('API Team');
    });

    test('[201] Создание пакета документов - районный суд', async ({ request }) => {
        // Аннотации для Allure
        AllureDecorators.story('Создание пакета документов для районного суда');
        AllureDecorators.severity('critical');
        AllureDecorators.tag('smoke');
        AllureDecorators.tag('api');
        AllureDecorators.description('Тест создания пакета документов для районного суда с указанным судом');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "a1c067b4-9f2a-400b-a280-c15d48957785",
            contractIds: ["127ee508-8acb-4993-82be-e01869241c64"]
        };

        await AllureDecorators.step('Подготовка тестовых данных', () => {
            AllureDecorators.attachJson('Request Body', requestBody);
        });

        const startTime = Date.now();

        const response = await AllureDecorators.step('Отправка POST запроса /v1/packages', async () => {
            return await request.post(`${baseUrl}/v1/packages`, {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await AllureDecorators.step('Валидация ответа', async () => {
            // Проверка статус кода
            expect(response.status(), 'Status code should be 201').toBe(201);

            // Проверка времени ответа
            expect(responseTime, `Response time ${responseTime}ms should be less than 5000ms`).toBeLessThan(5000);

            // Проверка Content-Type
            const contentType = response.headers()['content-type'];
            expect(contentType, 'Content-Type should be application/json').toContain('application/json');

            // Получение и валидация тела ответа
            const responseData = await response.json();
            AllureDecorators.attachJson('Response Body', responseData);

            expect(responseData.id, 'Response should contain package ID').toBeDefined();
            expect(typeof responseData.id, 'Package ID should be a string').toBe('string');

            // Прикрепляем метрики
            AllureDecorators.attachText('Performance Metrics',
                `Response Time: ${responseTime}ms\nStatus: ${response.status()}\nPackage ID: ${responseData.id}`
            );
        });
    });

    test('[404] Не найдены контракты', async ({ request }) => {
        AllureDecorators.story('Обработка ошибок');
        AllureDecorators.severity('normal');
        AllureDecorators.tag('negative');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "893592f1-e26a-4d96-a230-66767c26e77a",
            contractIds: [
                "06246991-37b4-42e9-8869-ee8265f6bdd5",
                "b5b0256a-f654-4fd1-bb3d-b2e84a8611d2"
            ]
        };

        AllureDecorators.attachJson('Invalid Request Body', requestBody);

        const response = await request.post(`${baseUrl}/v1/packages`, {
            data: requestBody
        });

        await AllureDecorators.step('Валидация ошибки 404', async () => {
            expect(response.status()).toBe(404);

            const errorData = await response.json();
            AllureDecorators.attachJson('Error Response', errorData);

            expect(errorData.status).toBeDefined();
            expect(errorData.errors).toBeDefined();
            expect(Array.isArray(errorData.errors)).toBe(true);
        });
    });

    test('[400] Ошибка валидации - не заполнено обязательное поле', async ({ request }) => {
        AllureDecorators.story('Валидация входных данных');
        AllureDecorators.severity('critical');

        const invalidRequestBody = {
            courtLawyerId: null, // невалидное значение
            packageTypeId: "71bb38da-44ed-491d-ac5b-0452774c67b9",
            contractIds: ["b4a817f8-0f85-4d32-a466-eb86106857c9"]
        };

        AllureDecorators.attachJson('Invalid Request', invalidRequestBody);

        const response = await request.post(`${baseUrl}/v1/packages`, {
            data: invalidRequestBody
        });

        await AllureDecorators.step('Валидация ошибки 400', async () => {
            expect(response.status()).toBe(400);

            const errorData = await response.json();
            AllureDecorators.attachJson('Validation Error', errorData);

            expect(errorData.status.code).toBe('BAD_REQUEST');
            expect(errorData.errors.length).toBeGreaterThan(0);
        });
    });
});