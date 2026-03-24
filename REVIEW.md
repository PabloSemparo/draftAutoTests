# Ревью репозитория `draftAutoTests`

Дата анализа: 2026-03-19

## Критичные проблемы

1. **Неработающий npm-скрипт конвертации Postman коллекции**
   - В `package.json` указан путь `scripts/Converter.js`, но такого файла в репозитории нет.
   - Из-за этого `npm run convert:postman` падает сразу с `MODULE_NOT_FOUND`.
   - Что исправить:
     - либо поправить путь в скрипте на реально существующий файл,
     - либо добавить отсутствующий файл в `scripts/`.

2. **Неработающий npm-скрипт API тестов (`test:api`)**
   - В `package.json` указан запуск `playwright test tests/api/`, но директория `tests/api` отсутствует.
   - Фактические API-тесты лежат в `API-Tests/` и именно этот путь задан в `playwright.config.ts`.
   - Что исправить:
     - заменить `test:api` на запуск `playwright test API-Tests/`.

3. **Скрипт отправки Allure-отчёта читает неверный путь**
   - В `scripts/send-allure-report.js` отчёт читается из `../test-results/index.html`,
     но генерация в проекте выполняется в `allure-report` (`allure generate ... -o allure-report`).
   - В текущем виде скрипт падает на `ENOENT` при отсутствии `test-results/index.html`.
   - Что исправить:
     - заменить путь чтения на `../allure-report/index.html` или унифицировать путь через переменную.

## Важные замечания (средний приоритет)

4. **Смешение латиницы и кириллицы в имени файла**
   - Файл `API-Tests/eq-dc-court/eq-dc-сourt-bankrupt.spec.ts` содержит кириллическую `с` в слове `сourt`.
   - Это источник трудноуловимых ошибок в импортах/скриптах и проблем на разных ОС/в IDE.
   - Что исправить:
     - переименовать файл с полностью латинским именем.

5. **Потенциально невалидный расчёт процента в email-отчёте**
   - В `scripts/send-results.js` процент считается как `(results.passed / results.total) * 100`.
   - Если `total === 0`, в письме попадёт `NaN%`.
   - Что исправить:
     - добавить защиту от деления на ноль (например, `total ? ... : 0`).

6. **`open` используется в TypeScript без зависимости в `package.json`**
   - В `utils/test-runners.ts` используется `require('open')`, но пакет `open` отсутствует в dependencies/devDependencies.
   - В рантайме это приведёт к `Cannot find module 'open'`.
   - Что исправить:
     - добавить зависимость `open`,
     - либо убрать авто-открытие отчёта и оставить только вывод пути.

## Что уже проверено

- Тесты в проекте обнаруживаются корректно через Playwright (`npm run test -- --list`), найдено 119 тестов.
- Основной разрыв — в служебных npm-скриптах и постобработке результатов, а не в `test discovery`.

## Рекомендуемый план правок

1. Починить `package.json` (`convert:postman`, `test:api`).
2. Исправить путь в `scripts/send-allure-report.js`.
3. Переименовать `eq-dc-сourt-bankrupt.spec.ts` в латиницу.
4. Добавить guard на `results.total === 0` в `scripts/send-results.js`.
5. Добавить пакет `open` или убрать соответствующий вызов из `utils/test-runners.ts`.
6. Прогнать smoke-команды:
   - `npm run test -- --list`
   - `node scripts/send-allure-report.js` (на подготовленном отчёте)
   - `node -e "require('./utils/test-runners.ts')"` / либо unit-проверку модуля после правки.
