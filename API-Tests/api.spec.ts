import { test, expect } from '@playwright/test';

test.describe('API тесты', () => {
  const BASE_URL = 'https://petstore.swagger.io';
  const API_KEY = 'api_key'; // При неободимости заменить на используемый API ключ

    test('Проверка 2', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/v2/pet`, {
        headers: {
          'api_key': API_KEY,
        },
        data: {
        id: 666,
          category: {
          id: 2,
            name: "Сосиска"
        },
        name: "Сосисулька",
          photoUrls: [
          "Пусто"
        ],
          tags: [
          {
            id: 0,
            name: "string"
          }
        ],
          status: "available"
      }
      });
      //Проверка статуса ответа
      expect(response.status()).toBe(200);

      // Проверка content-type
      expect(response.headers()['content-type']).toContain('application/json');

      // Получение тела ответа
      const responseBody = await response.json();

      // Валидация JSON-схемы
      expect(responseBody).toEqual(expect.objectContaining({
        id: expect.any(Number),
        category: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String)
        }),
        name: expect.any(String),
        photoUrls: expect.arrayContaining([expect.any(String)]),
        tags: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String)
          })
        ]),
        status: expect.stringMatching(/available|pending|sold/)
      }));
      // Дополнительные проверки значений
      expect(responseBody.id).toBe(666);
      expect(responseBody.name).toBe('Сосисулька');
      expect(responseBody.status).toBe('available');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');})})