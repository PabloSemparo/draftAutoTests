# EQVCOL_AT

Автотесты EQVCOL: API-тесты (Playwright + TypeScript) — `API-Tests/`,
вспомогательные модули — `utils/`, `scripts/`, `src/`.

## Быстрый старт

```bash
npm ci
npx playwright install chromium

copy env_settings\.env.example env_settings\.env.stage   # и заполнить API_KEY (см. ниже)

npx playwright test                                       # все API-тесты
npx playwright test API-Tests/tests/eq-legal-collection   # один набор
npm run typecheck                                         # проверка типов
```

## Переменные окружения

`playwright.config.ts` загружает `env_settings/.env.stage`, созданный из
`env_settings/.env.example`. Файл `.env.stage` **не хранится в git**, так как в нём секреты.

| Переменная | Назначение |
|---|---|
| `BASE_URL` | Адрес окружения, к которому идут API-тесты |
| `API_KEY` | API-ключ eq-legal-collection: заголовок `x-api-key` (см. `/v3/api-docs`) |
| `AUTH_TOKEN` | Токен остальных сервисов: `Authorization: Bearer` |
| `API_DEBUG` | `true` — подробный лог запросов/ответов в `ApiClient` (секреты маскируются) |
| `HEADLESS`, `SLOW_MO` | Настройки запуска браузера |

В CI секреты передаются переменными GitLab CI/CD (masked), например `API_KEY`.

## Структура API-Tests

- `utils/apiClient.ts` — базовый HTTP-клиент: сквозные заголовки, `x-api-key`/`Bearer`,
  таймауты, логирование, безопасный разбор тела ответа
- `services/*.ts` — сервисы по доменам (сейчас `EnforcementService`)
- `models/*.ts` — DTO ответов
- `tests-data/*.ts` — тестовые данные и ожидаемые значения
- `tests/<сервис>/**` — спеки Playwright

## Отчёты

Прогон формирует `playwright-report/`, `allure-results/` и `test-results.json` —
это артефакты, в git они не хранятся. Полный отчёт с отправкой по почте: `npm run test:report`.
