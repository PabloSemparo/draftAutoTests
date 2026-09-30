# Инструкция по использованию API-тестов

## Быстрый старт

### Установка

```bash
npm install
```

### Запуск тестов

```bash
# Запуск всех тестов
npm test

# Запуск тестов с UI
npm run test:api:ui

# Запуск тестов в отладке
npm run test:api:debug

# Запуск тестов для конкретного сервиса
npm run test:api:legal
npm run test:api:dc-court
npm run test:api:debt-importer
npm run test:api:debt-collection
```

### Генерация отчета

```bash
# Генерация и открытие Allure отчета
npm run test:report

# Только генерация
npm run test:allure:generate

# Только открытие
npm run test:allure:open
```

### Проверка типов

```bash
npm run typecheck
```

## Новые паттерны

### Фикстуры

```typescript
import { getValidDebtPackage, getValidContractorPayload } from '../fixtures';

const package = getValidDebtPackage();
const contractor = getValidContractorPayload({ status: 'ACTIVE' });
```

### Утилиты

```typescript
import { BaseTestUtils, PackageAssertions } from '../test-utils';

await BaseTestUtils.setupAllure('Feature', 'Story', 'Description');
BaseTestUtils.validatePackageResponseStructure(responseBody);
```

### Конфигурация

```typescript
import { apiConfig } from '../config/apiConfig';
const baseUrl = apiConfig.eqDebtCollection.baseUrl;
```

## Примеры тестов

### Простой тест

```typescript
import { test, expect } from '@playwright/test';
import { DebtCollectionService } from '../services/debtCollectionService';
import { BaseTestUtils } from '../test-utils';

test('should get package by id', async ({ request }) => {
  const service = new DebtCollectionService(request);
  const response = await service.getPackageById('package-id');
  
  expect(response.status.code).toBe('SUCCESS');
  BaseTestUtils.validatePackageResponseStructure(response.data);
});
```

### Тест с фикстурами

```typescript
import { test, expect } from '@playwright/test';
import { DebtImporterService } from '../services/debtImporterService';
import { getValidContractorPayload } from '../fixtures';

test('should create contractor', async ({ request }) => {
  const service = new DebtImporterService(request);
  const payload = getValidContractorPayload({ status: 'ACTIVE' });
  
  const response = await service.createContractor(payload);
  
  expect(response.status.code).toBe('SUCCESS');
  expect(response.data.id).toBeDefined();
});
```

### Тест с Allure

```typescript
import { test, expect } from '@playwright/test';
import { BaseTestUtils } from '../test-utils';

test('should handle boundary values', async ({ request }) => {
  await BaseTestUtils.setupAllure(
    'Validation',
    'Boundary Values',
    'Validates boundary values',
    'normal',
    ['smoke']
  );
  
  // тест код
});
```

## Troubleshooting

### Ошибка: BASE_URL is required

Установите переменную окружения:

```bash
export BASE_URL="https://your-api-url"
```

### Ошибка: AUTH_TOKEN is required

Установите переменную окружения:

```bash
export AUTH_TOKEN="your-auth-token"
```

### Ошибка: TypeScript type checking failed

Запустите проверку типов:

```bash
npm run typecheck
```

### Allure отчет не создается

Убедитесь, что allure-commandline установлен:

```bash
npm install -g allure-commandline
```