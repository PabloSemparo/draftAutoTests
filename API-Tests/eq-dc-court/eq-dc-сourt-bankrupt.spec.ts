import { test, expect } from '@playwright/test';

test('Проверка на банкротство с валидными данными [200 CODE]', async ({ request }) => {
  const BASE_URL = 'http://eq-dc-court.test2.mmk.local'
  const response = await request.get(`${BASE_URL}/v1/bankrupts/check`, {
    headers: {
      'X-API-KEY': '55298707-117c-44a5-8434-162fb9d2e4c5',
      'Accept': 'application/json'
    },
    params: {
      inn: '614334131355',
      fio: 'Старченко Владислав Владимирович',
      birthDate: '1996-11-26'
    }
  });

  expect(response.status()).toBe(200);
});
