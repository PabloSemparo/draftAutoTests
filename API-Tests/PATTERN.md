# Паттерны тестирования API

## Фикстуры

Фикстуры - это фабрики для создания валидных тестовых данных. Они используются для:

- Устранения дублирования кода
- Обеспечения консистентности тестовых данных
- Упрощения поддержки тестов

### Создание фикстур

```typescript
import { getValidDebtPackage } from '../fixtures';

// Базовая фикстура
const package = getValidDebtPackage();

// С переопределением полей
const packageWithStatus = getValidDebtPackage({ statusCode: 'ACTIVE' });
```

### Доступные фикстуры

- `getValidDebtPackage()` - валидный пакет долгов
- `getValidDebtData()` - минимальный пакет данных
- `getValidContract()` - валидный контракт
- `getValidContractorPayload()` - валидный контрактор
- `getValidCourtSearchItem()` - валидный элемент поиска судов
- `getValidBankruptCheckParams()` - валидные параметры проверки банкротства

## Утилиты

Утилиты - это вспомогательные функции для тестирования. Они используются для:

- Валидации API ответов
- Логирования в Allure
- Настройки окружения тестов

### Основные утилиты

```typescript
import { BaseTestUtils, PackageAssertions } from '../test-utils';

// Настройка Allure метаданных
await BaseTestUtils.setupAllure(
  'Debt Collection',
  'Package Creation',
  'Valid Package Creation',
  'critical',
  ['smoke', 'regression']
);

// Валидация времени ответа
const responseTime = await BaseTestUtils.validateResponseTime(startTime, 1000);

// Валидация структуры пакета
BaseTestUtils.validatePackageResponseStructure(responseBody);
```

### Доступные утилиты

- `BaseTestUtils.setupAllure()` - настройка Allure метаданных
- `BaseTestUtils.validateResponseTime()` - валидация времени ответа
- `BaseTestUtils.validateStatusCode()` - валидация статус кода
- `BaseTestUtils.validatePackageResponseStructure()` - валидация структуры пакета
- `PackageAssertions.validatePackageResponseStructure()` - ассерты для пакетов
- `CourtAssertions.validateBankruptCheckResponse()` - ассерты для судов
- `DebtImporterAssertions.validateContractorCreationResponse()` - ассерты для импортеров
- `boundaryValues.generate()` - генерация граничных значений

## Конфигурация

Конфигурация API используется для:

- Централизованного управления настройками
- Поддержки разных окружений (stage, production)
- Типизированного доступа к настройкам

### Использование конфигурации

```typescript
import { apiConfig } from '../config/apiConfig';

// Базовые URL
const legalCollectionUrl = apiConfig.eqLegalCollection.baseUrl;
const debtCollectionUrl = apiConfig.eqDebtCollection.baseUrl;
const dcCourtUrl = apiConfig.eqDcCourt.baseUrl;
const dcDebtImporterUrl = apiConfig.eqDcDebtImporter.baseUrl;

// API ключи и токены
const apiKey = apiConfig.eqLegalCollection.apiKey;
const debtCollectionToken = apiConfig.eqDcCourt.token;
const debtImporterToken = apiConfig.eqDcDebtImporter.token;
```

### Доступные настройки

- `eqLegalCollection.baseUrl` - URL eq-legal-collection
- `eqDebtCollection.baseUrl` - URL eq-debt-collection
- `eqDcCourt.baseUrl`, `apiKey`, `token` - настройки eq-dc-court
- `eqDcDebtImporter.baseUrl`, `token` - настройки eq-dc-debt-importer

## Сервисы

Сервисы - это обертки для API запросов. Они используются для:

- Упрощения вызова API endpoints
- Централизованного управления аутентификацией
- Использования фикстур для создания тестовых данных

### Использование сервисов

```typescript
import { DebtImporterService } from '../services/debtImporterService';
import { DebtCollectionService } from '../services/debtCollectionService';
import { DcCourtService } from '../services/dcCourtService';

// Создание сервиса
const debtImporterService = new DebtImporterService(request, {
  requireAuth: true,
});

// Использование фикстур
const contractorResponse = await debtImporterService.createTestContractor({
  status: 'ACTIVE',
});

const packageResponse = await debtCollectionService.createTestPackage({
  statusCode: 'ACTIVE',
});
```

## Сервисы

Сервисы - это обертки для API запросов. Они используются для:

- Упрощения вызова API endpoints
- Централизованного управления аутентификацией
- Использования фикстур для создания тестовых данных

### Использование сервисов

```typescript
import { DebtImporterService } from '../services/debtImporterService';
import { DebtCollectionService } from '../services/debtCollectionService';
import { DcCourtService } from '../services/dcCourtService';

// Создание сервиса
const debtImporterService = new DebtImporterService(request, {
  requireAuth: true,
});

// Использование фикстур
const contractorResponse = await debtImporterService.createTestContractor({
  status: 'ACTIVE',
});

const packageResponse = await debtCollectionService.createTestPackage({
  statusCode: 'ACTIVE',
});
```

### Доступные сервисы

- `DebtImporterService` - для eq-dc-debt-importer
- `DebtCollectionService` - для eq-debt-collection
- `DcCourtService` - для eq-dc-court

### Методы с фикстурами

- `createTestContractor()` - создать контрактор с фикстурами
- `createTestContractImport()` - создать импорт контракта с фикстурами
- `createTestPackage()` - создать пакет с фикстурами
- `getTestBankruptCheckParams()` - получить параметры проверки банкротства
- `getTestCourtSearchItem()` - получить элемент поиска судов

## Allure

Allure используется для:

- Логирования шагов теста
- Прикрепления вложений (JSON, текст)
- Установки метаданных (эпик, фича, история)
- Параметризации тестов

### Использование Allure

```typescript
import { Allure } from '../utils/allure-decorators';

// Установка метаданных
await Allure.epic('Debt Collection');
await Allure.feature('Package Creation');
await Allure.story('Valid Package Creation');
await Allure.severity('critical');
await Allure.tag('smoke');
await Allure.tag('regression');

// Прикрепление ответа API
await Allure.attachApiResponse(response);

// Создание шага
await Allure.step('Create Package', async () => {
  // код шага
});
```

## Границы значений

Граничные значения используются для:

- Тестирования граничных условий
- Валидации ограничений API
- Проверки обработки ошибок

### Использование граничных значений

```typescript
import { boundaryValues } from '../test-utils';

// Генерация граничных значений
const values = boundaryValues.generate(1, 100);
// [0, 1, 2, 99, 100, 101]

// Использование в тесте
test('validates boundary values', async () => {
  for (const value of boundaryValues.generate(1, 100)) {
    // тест с value
  }
});
```

## Примеры

### Полнценный тест с новой архитектурой

```typescript
import { test, expect } from '@playwright/test';
import { DebtImporterService } from '../services/debtImporterService';
import { BaseTestUtils, PackageAssertions } from '../test-utils';
import { getValidDebtPackage } from '../fixtures';

test('should create valid package', async ({ request }) => {
  // Настройка Allure
  await BaseTestUtils.setupAllure(
    'Debt Collection',
    'Package Creation',
    'Valid Package Creation',
    'normal',
    ['smoke', 'regression']
  );

  // Создание сервиса
  const service = new DebtImporterService(request);

  // Создание тестового пакета с фикстурами
  const packageData = getValidDebtPackage({ statusCode: 'ACTIVE' });

  // Вызов API
  const startTime = Date.now();
  const response = await service.createPackage(packageData);
  await BaseTestUtils.validateResponseTime(startTime, 1000);

  // Валидация
  expect(response.status.code).toBe('SUCCESS');
  PackageAssertions.validatePackageResponseStructure(response.data);

  // Прикрепление к отчету
  await BaseTestUtils.logAttachment('Request', JSON.stringify(packageData));
  await BaseTestUtils.logAttachment('Response', JSON.stringify(response));
});
```

### Тест с граничными значениями

```typescript
import { test, expect } from '@playwright/test';
import { BaseTestUtils } from '../test-utils';

test('should handle boundary values', async ({ request }) => {
  for (const pageSize of boundaryValues.generate(1, 100)) {
    const response = await request.get('/packages', {
      params: { pageSize },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.length).toBeLessThanOrEqual(pageSize);
  }
});
```