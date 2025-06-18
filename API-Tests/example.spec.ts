import { test, expect } from '@playwright/test';

test('Переход на страницу', async ({ page }) => {
  await page.goto('https://lc.test5.mmk.local');
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.goto('https://lc.test5.mmk.local/contracts');
  await expect(page).toHaveTitle("Legal Collection");
});

test('Переход на страницу Список договоров', async ({ page }) => {
  await page.goto('https://lc.test5.mmk.local/contracts');
  await expect(page).toHaveTitle("Legal Collection");
  await page.screenshot({ path: `Contract.png` });
});
test('Проверка авторизации', async ({ page }) => {
await page.goto('https://lc.test5.mmk.local');
await page.getByLabel('Логин').fill('admin');
await page.getByLabel('Пароль').fill('admin');
await page.getByRole('button', { name: 'Войти' }).click();
await page.waitForURL('https://lc.test5.mmk.local/contracts');
await page.getByRole('menuitem', { name: 'Задания на печать' }).click();
await page.waitForURL('https://lc.test5.mmk.local/print-tasks')
await page.screenshot({ path: `print-tasks.png` });
await expect(page.getByRole('button', { name: 'Добавить' })).toBeVisible()})
