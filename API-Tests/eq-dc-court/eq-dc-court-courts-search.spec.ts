import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://eq-dc-court.test2.mmk.local/v1';
const API_TOKEN = '55298707-117c-44a5-8434-162fb9d2e4c5'; // Замените на реальный токен

test.describe('EQ DC Court API тесты', () => {
  // Вариант 1: Добавляем токен в заголовки для всех тестов
  test.use({
    extraHTTPHeaders: {
      'X-API-Key': `55298707-117c-44a5-8434-162fb9d2e4c5`,
    },
  });

  test('Проверка на банкротство с валидными данными [200 CODE]', async ({ request }) => {
    const params = new URLSearchParams({
      inn: '614334131355',
      fio: 'Старченко Владислав Владимирович',
      birthDate: '1996-11-26'
    });

    // Вариант 2: Добавляем токен непосредственно в запрос (если нужно переопределить)
    const response = await request.get(`${API_BASE_URL}/bankrupts/check?${params}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    // Проверка статуса кода
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Проверка заголовка Content-Type
    expect(response.headers()['content-type']).toContain('application/json');

    // Проверка наличия и типа поля status
    expect(responseBody).toHaveProperty('status');
    expect(typeof responseBody.status).toBe('string');
  });

  // Тест на проверку авторизации
  test('Реджектим если нет api токена', async ({ request }) => {
    const params = new URLSearchParams({
      inn: '614334131355',
      fio: 'Старченко Владислав Владимирович',
      birthDate: '1996-11-26'
    });

    // Делаем запрос без токена
    const response = await request.get(`${API_BASE_URL}/bankrupts/check?${params}`, {
      headers: {} // Очищаем заголовки
    });
  });
});