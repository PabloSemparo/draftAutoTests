import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://eq-dc-court.test2.mmk.local/v1';
const API_KEY = '55298707-117c-44a5-8434-162fb9d2e4c5'; // Замените на реальный API ключ

test.describe('API Тесты', () => {
    // Общая конфигурация для всех тестов - добавляем API ключ в заголовки
    test.use({
        extraHTTPHeaders: {
            'X-API-KEY': `${API_KEY}`,
            // Или, если используется X-API-Key:
            // 'X-API-Key': API_KEY,
        },
    });

    test('Проверка на банкротство [CODE 200]', async ({ request }) => {
        const params = new URLSearchParams({
            inn: '614334131355',
            fio: 'Старченко Владислав Владимирович',
            birthDate: '1996-11-26'
        });

        const response = await request.get(`${API_BASE_URL}/bankrupts/check?${params}`);

        // Проверка статуса кода
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Проверка заголовка Content-Type
        expect(response.headers()['content-type']).toContain('application/json');

        // Проверка наличия и типа поля status
        expect(responseBody).toHaveProperty('status');
        expect(typeof responseBody.status).toBe('string');
    });

    test('Поиск судов возвращает суд по валиданому адресу [CODE 200]', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/courts/search?address=Ульяновск, проспект ульяновский 2`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        if (responseBody.length > 0) {
            const court = responseBody[0];
            expect(court).toHaveProperty('id');
            expect(court).toHaveProperty('name');
            expect(court).toHaveProperty('address');

            if (court.hasOwnProperty('dutyAmount')) {
                expect(Number.isInteger(court.dutyAmount)).toBeTruthy();
                expect(court.dutyAmount).toBeGreaterThanOrEqual(0);
            }
        }
    });

    test('Запрос без API ключа', async ({ request }) => {

        const response = await request.get(`${API_BASE_URL}/bankrupts/check`, {
            headers: {} // Переопределяем заголовки, удаляя авторизацию
        });

        expect(response.status()).toBe(422);


    });

    test('Получаем ошибку, если отсутствует обязательное поле [400 CODE]', async ({ request }) => {
            // Делаем запрос без обязательных параметров
            const response = await request.get(`${API_BASE_URL}/bankrupts/check`);

            // Проверяем статус код (ожидаем 400 Bad Request или 422 Unprocessable Entity)
            expect(response.status()).toBeGreaterThanOrEqual(400);
            expect(response.status()).toBeLessThan(500);

            const responseBody = await response.json();

            // Проверяем структуру ответа
            expect(responseBody).toEqual({
                status: {
                    code: "VALIDATION",
                    description: "Для проверки банкротства должно быть заполнено inn или fio + birthDate"
                }
            });

            // Альтернативный вариант с поэтапной проверкой
            expect(responseBody).toHaveProperty('status');
            expect(responseBody.status).toEqual(expect.objectContaining({
                code: "VALIDATION",
                description: "Для проверки банкротства должно быть заполнено inn или fio + birthDate"
            }));
        });

// Дополнительные тесты для разных комбинаций параметров
        test.describe('Проверки валидации', () => {
            const testCases = [
                {
                    name: 'Пропущена все поля',
                    params: {},
                    expectedError: "Для проверки банкротства должно быть заполнено inn или fio + birthDate"
                },
                {
                    name: 'Перадано только ФИО',
                    params: { fio: 'Иванов Иван Иванович' },
                    expectedError: "Для проверки банкротства должно быть заполнено inn или fio + birthDate"
                },
                {
                    name: 'Только дата рождения без ФИО',
                    params: { birthDate: '1990-01-01' },
                    expectedError: "Для проверки банкротства должно быть заполнено inn или fio + birthDate"
                }
            ];

            testCases.forEach(({ name, params, expectedError }) => {
                test(`Validation: ${name}`, async ({ request }) => {
                    const query = new URLSearchParams(params);
                    const response = await request.get(`${API_BASE_URL}/bankrupts/check?${query}`);

                    expect(response.status()).toBeGreaterThanOrEqual(400);

                    const responseBody = await response.json();
                    expect(responseBody.status.description).toBe(expectedError);
    });
});})})