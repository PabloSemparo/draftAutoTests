# OpenAPI Tests for eq-debt-collection

Этот набор тестов основан на OpenAPI спецификации (`eq-dc_open-api.txt`) и использует архитектуру проекта API-Tests.

## Структура

```
tests/eq-debt-collection/openapi/
├── shared/                    # Общие утилиты для всех тестов
│   ├── types.ts              # Константы и конфигурация
│   ├── test-utils.ts         # Расширенные утилиты тестирования
│   └── contract.ts           # Фикстуры контрактов
├── facsimile-get-list.spec.ts      # GET /v1/facsimiles (список)
├── package-get-list.spec.ts        # GET /v1/packages (список)
├── package-get-by-id.spec.ts       # GET /v1/packages/{id}
├── package-create.spec.ts          # POST /v1/packages (создание)
└── package-update-status.spec.ts   # PATCH /v1/packages/{id}/status

models/openapi/               # Типы из OpenAPI
├── facsimile.ts
├── package.ts
└── index.ts

fixtures/openapi/             # Генераторы тестовых данных
├── facsimile.ts
├── package.ts
└── index.ts

services/openapi/             # Service layer для API
├── facsimileService.ts
├── packageService.ts
└── index.ts
```

## Использование

### Запуск тестов

```bash
# Из корня проекта
npx playwright test API-Tests/tests/eq-debt-collection/openapi

# С фильтрацией по файлу
npx playwright test API-Tests/tests/eq-debt-collection/openapi/package-get-by-id.spec.ts

# С фильтрацией по названию теста
npx playwright test API-Tests/tests/eq-debt-collection/openapi -g "Получение пакета по ID"
```

### Добавление новых тестов

1. Создайте файл в `tests/eq-debt-collection/openapi/`
2. Используйте `BaseTestUtils` и `OpenApiTestUtils` для отчетности
3. Используйте `TEST_CONSTANTS` и `TEST_CONFIG` из `shared/types.ts`
4. Используйте сервисы из `services/openapi/` для запросов
5. Используйте фикстуры из `fixtures/openapi/` для генерации данных

### Пример теста

```typescript
import { test } from '@playwright/test';
import { TEST_CONSTANTS, TEST_CONFIG } from './shared/types';
import { OpenApiTestUtils } from './shared/test-utils';

test('[200] Успешный запрос', async ({ request }) => {
  const response = await request.get(`${TEST_CONSTANTS.BASE_URL}/api/v1/packages`);
  OpenApiTestUtils.validateStatusCode(response.status(), TEST_CONFIG.STATUS_CODES.SUCCESS);
});
```

## Методы OpenAPI

### Facsimile API
- `GET /api/v1/facsimiles` - Список факсимиле
- `GET /api/v1/facsimiles/{id}` - Получение по ID
- `POST /api/v1/facsimiles` - Создание
- `PUT /api/v1/facsimiles/{id}` - Обновление
- `DELETE /api/v1/facsimiles/{id}` - Удаление
- `PUT /api/v1/facsimiles/lawyer/{lawyerId}` - Upsert по lawyerId

### Package API
- `GET /api/v1/packages` - Список пакетов
- `GET /api/v1/packages/{id}` - Получение по ID
- `POST /api/v1/packages` - Создание
- `PUT /api/v1/packages/{id}` - Обновление
- `DELETE /api/v1/packages/{id}` - Удаление
- `PATCH /api/v1/packages/{id}/status` - Обновление статуса
- `PUT /api/v1/packages/{id}/documents/{documentId}/file-info` - Обновление FileInfo
- `PUT /api/v1/packages/{id}/documents/{documentId}/exclude` - Исключить документ
- `POST /api/v1/packages/{id}/documents/{documentId}/convert/gas` - Конвертация в ГАС
- `POST /api/v1/packages/{id}/documents/recreate` - Пересоздать документы
- `POST /api/v1/packages/{id}/print` - Печать
- `POST /api/v1/packages/{id}/prepare-for-gas` - Подготовка для ГАС

## Конфигурация

Константы и конфигурация находятся в `shared/types.ts`:
- `BASE_URL` - Базовый URL API (из переменной окружения `BASE_URL`)
- `STATUS_CODES` - Ожидаемые HTTP статусы
- `RESPONSE_TIME` - Лимиты времени ответа
- `TEST_HEADERS` - Предустановленные заголовки

## Allure отчеты

Все тесты используют Allure для отчетности. Запускайте с флагом `--allure` для генерации отчета:

```bash
npx playwright test --allure
```