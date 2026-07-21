import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// Простые декораторы прямо в файле
class TestDecorators {
    static epic(epic: string) {
        allure.epic(epic);
    }

    static feature(feature: string) {
        allure.feature(feature);
    }

    static step(name: string, body: () => any) {
        return allure.step(name, body);
    }

    static attachJson(name: string, data: any) {
        allure.attachment(name, JSON.stringify(data, null, 2), 'application/json');
    }
}

test.describe('API Пакетов Документов', () => {

    test.beforeEach(() => {
        TestDecorators.epic('EqvaCollection API');
        allure.feature('Создание пакета документов');
        allure.owner('API Team');
    });

    test('[201] Создание пакета документов - районный суд', async ({ request }) => {
        // Аннотации для Allure
        allure.story('Создание пакета DISTRICT типа');
        allure.severity('critical');
        allure.tag('smoke');
        allure.tag('api');
        allure.description('Тест создания пакета документов для районного суда с указанным судом');

        const requestBody = {
            courtLawyerId: "96f007da-441e-4dfd-9be0-36ccefe6e58b",
            packageTypeId: "a1c067b4-9f2a-400b-a280-c15d48957785",
            contractIds: ["127ee508-8acb-4993-82be-e01869241c64"]
        };

        await TestDecorators.step('Подготовка тестовых данных', () => {
            TestDecorators.attachJson('Request Body', requestBody);
        });

        const startTime = Date.now();

        const response = await TestDecorators.step('Отправка POST запроса /v1/packages', async () => {
            return await request.post('/v1/packages', {
                data: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        });

        const responseTime = Date.now() - startTime;

        await TestDecorators.step('Валидация ответа', async () => {
            // Проверка статус кода
            expect(response.status(), 'Status code should be 201').toBe(201);

            // Проверка времени ответа
            expect(responseTime, `Response time ${responseTime}ms should be less than 5000ms`).toBeLessThan(5000);

            // Проверка Content-Type
            const contentType = response.headers()['content-type'];
            expect(contentType, 'Content-Type should be application/json').toContain('application/json');

            // Получение и валидация тела ответа
            const responseData = await response.json();
            TestDecorators.attachJson('Response Body', responseData);

            expect(responseData.id, 'Response should contain package ID').toBeDefined();
            expect(typeof responseData.id, 'Package ID should be a string').toBe('string');

            // Прикрепляем метрики
            allure.attachment('Performance Metrics',
                `Response Time: ${responseTime}ms\nStatus: ${response.status()}\nPackage ID: ${responseData.id}`,
                'text/plain'
            );
        });
    });
});