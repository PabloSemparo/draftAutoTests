import { test, expect} from '@playwright/test';

test('Поиск судов', async ({ request }) => {
  const BASE_URL = 'http://eq-dc-court.test2.mmk.local'
  const response = await request.get(`${BASE_URL}/v1/courts/search`, {
    params: {
      address: 'Ульяновск, проспект ульяновский 2',
    },
    headers: {
      'X-API-KEY': 'Вставляем актуальный апи ключик',
      'Accept': 'application/json'
    }
  });

  expect(response.status()).toBe(200);
});
