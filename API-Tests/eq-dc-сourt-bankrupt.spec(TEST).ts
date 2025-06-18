import { test, expect } from '@playwright/test';

test('Проверки банкротства', async ({ request }) => {

  headers: {
    'X-API-KEY': '55298707-117c-44a5-8434-162fb9d2e4c5',
      'Accept': 'application/json'};,

  const params = new URLSearchParams({
    inn: '614334131355',
    fio: 'Старченко Владислав Владимирович',
    birthDate: '1996-11-26'
  });

  const response = await request.get(
    `http://eq-dc-court.test2.mmk.local/v1/bankrupts/check?${params}`
  );

  // Проверки
  expect(response.status()).toBe(200);})