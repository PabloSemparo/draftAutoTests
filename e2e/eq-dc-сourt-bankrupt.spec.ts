import { test, expect } from '@playwright/test';

test('Проверка на банкротство', async ({ request }) => {
  const BASE_URL = 'http://eq-dc-court.test2.mmk.local'
  const response = await request.get(`${BASE_URL}/v1/bankrupts/check`, {
    params: {
      inn: '614334131355',
      fio: 'Старченко Владислав Владимирович',
      birthDate: '1996-11-26'
    },
    headers: {
      'X-API-KEY': '55298707-117c-44a5-8434-162fb9d2e4c5',
      'Accept': 'application/json'
    }
  });

  expect(response.status()).toBe(200);
});