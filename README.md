# EQVCOL_AT

Автотесты EQVCOL: API-тесты (Playwright + TypeScript) — `API-Tests/`,
вспомогательные модули — `utils/`, `scripts/`, `src/`.

## Быстрый старт

```bash
npm ci
npx playwright install chromium

copy env_settings\.env.example env_settings\.env.stage   # Windows
# cp env_settings/.env.example env_settings/.env.stage    # Linux/macOS

# Заполнить env_settings/.env.stage: base URLs, API_KEY/AUTH_TOKEN и IDs тестовых данных.

npm run typecheck:api                                    # проверка типов мигрированного API-слоя
npm run test:api                                         # все мигрированные API-наборы
npm run test:api:legal                                   # только eq-legal-collection
npm run test:api:dc-court                                # только eq-dc-court
npm run test:api:debt-importer                           # только выбранные eq-dc-debt-importer спеки
```

Дополнительно можно запускать Playwright напрямую:

```bash
npx playwright test API-Tests/tests/eq-legal-collection --project=chromium
```

> `npm run test:api` требует заполненных секретов и адресов сервисов. Без них тесты могут падать до отправки запросов.

## Переменные окружения

`playwright.config.ts` загружает `env_settings/.env.stage`, созданный из
`env_settings/.env.example`. Файл `.env.stage` **не хранится в git**, так как в нём секреты.

| Переменная | Назначение |
|---|---|
| `EQ_LEGAL_COLLECTION_BASE_URL` | Canonical base URL сервиса `eq-legal-collection` |
| `BASE_URL` | Legacy/fallback base URL для `eq-legal-collection` |
| `EQ_DEBT_COLLECTION_BASE_URL` | Canonical base URL сервиса `eq-debt-collection` |
| `STAGING_BASE_URL` | Legacy/fallback stage URL для `eq-debt-collection` |
| `API_KEY` | API-ключ `eq-legal-collection`; также fallback для `EQ_DC_COURT_API_KEY` |
| `AUTH_TOKEN` | Общий Bearer-токен; fallback для сервисных токенов |
| `EQ_DC_COURT_BASE_URL` | Base URL сервиса `eq-dc-court` |
| `EQ_DC_COURT_API_KEY` | API-ключ `eq-dc-court`, заголовок `X-API-KEY` |
| `EQ_DC_COURT_TOKEN` | Bearer-токен `eq-dc-court`, если нужен окружением |
| `EQ_DC_COURT_TEST_INN`, `EQ_DC_COURT_TEST_FIO`, `EQ_DC_COURT_TEST_BIRTH_DATE`, `EQ_DC_COURT_TEST_ADDRESS` | Тестовые данные для bankrupt/court search сценариев |
| `EQ_DC_DEBT_IMPORTER_BASE_URL` | Canonical base URL сервиса `eq-dc-debt-importer` |
| `API_URL` | Legacy/fallback base URL для `eq-dc-debt-importer` |
| `EQ_DC_DEBT_IMPORTER_TOKEN` | Bearer-токен `eq-dc-debt-importer` |
| `CONTRACTOR_ID`, `CONTRACT_IMPORT_ID`, `CONTRACT_ID`, `PACKAGE_ID` | IDs тестовых данных для importer/debt-collection сценариев |
| `API_DEBUG` | `true` — подробный лог запросов/ответов в `ApiClient` (секреты маскируются) |
| `HEADLESS`, `SLOW_MO` | Настройки запуска браузера |

В CI секреты передаются переменными GitLab CI/CD (`Settings → CI/CD → Variables`) и должны быть masked/protected при необходимости. Минимально для stage-прогона нужны актуальные base URL и секреты сервисов, участвующих в `npm run test:api`.

## NPM scripts для API

| Скрипт | Что запускает |
|---|---|
| `npm run typecheck:api` | `tsc --noEmit -p tsconfig.api.json` для нового API-слоя и уже мигрированных suites |
| `npm run test:api` | `eq-legal-collection`, `eq-dc-court` и выбранные `eq-dc-debt-importer` спеки |
| `npm run test:api:legal` | Только `API-Tests/tests/eq-legal-collection` |
| `npm run test:api:dc-court` | Только `API-Tests/tests/eq-dc-court` |
| `npm run test:api:debt-importer` | Только мигрированные contract imports/contractors спеки `eq-dc-debt-importer` |

`tsconfig.api.json` намеренно ограничен мигрированными файлами. Остальные старые API-наборы подключаются к typecheck по мере рефакторинга и исправления предсуществующих ошибок типов.

## Структура API-Tests

- `utils/apiClient.ts` — базовый HTTP-клиент: сквозные заголовки, `x-api-key`/`Bearer`,
  таймауты, логирование, безопасный разбор тела ответа
- `utils/apiResponse.ts` — типизированная обёртка ответа API
- `utils/assertions.ts` — общие проверки статусов/тел ответов
- `config/apiConfig.ts` — единая точка чтения env-переменных для API-тестов
- `services/*.ts` — сервисы по доменам (`EnforcementService`, `DcCourtService`, `DebtImporterService`, `DebtCollectionService`)
- `models/*.ts` — DTO запросов/ответов
- `tests-data/*.ts` — тестовые данные и ожидаемые значения
- `tests/<сервис>/**` — спеки Playwright

При миграции новых API-спеков предпочтительный подход — не вызывать `request.get/post/...` напрямую в тестах, а добавлять типизированный метод в соответствующий service-класс и использовать общие assertions.

## CI

GitLab job `api-tests` выполняет:

```bash
npm ci
npx playwright install chromium
npm run typecheck:api
npm run test:api -- --reporter=html,line --project=chromium
```

Для успешного CI-прогона нужно заранее настроить GitLab CI/CD variables для всех сервисов из `test:api`: base URL, API keys/tokens и необходимые IDs тестовых данных.

## Отчёты

Прогон формирует `playwright-report/`, `allure-results/` и `test-results.json` —
это артефакты, в git они не хранятся. Полный отчёт с отправкой по почте: `npm run test:report`.
