# API Tests

## Структура проекта

```
API-Tests/
├── fixtures/              # Централизованные фикстуры тестовых данных
│   ├── index.ts
│   ├── types.ts
│   ├── debtImporter.ts
│   ├── debtCollection.ts
│   └── dcCourt.ts
├── test-utils/            # Централизованные утилиты тестирования
│   ├── index.ts
│   ├── base-test-utils.ts
│   ├── assertions.ts
│   ├── allure-config.ts
│   └── boundary-values.ts
├── config/
│   └── apiConfig.ts
├── models/                # Модели API ответов
├── services/              # Сервисы для работы с API
├── tests-data/            # Статические данные для тестов
├── utils/                 # Вспомогательные утилиты
├── tests/                 # Тестовые наборы
│   ├── eq-legal-collection/
│   ├── eq-dc-court/
│   ├── eq-dc-debt-importer/
│   └── eq-debt-collection/
├── playwright.config.ts   # Конфигурация Playwright
├── tsconfig.api.json      # Конфигурация TypeScript
└── REFACTORING.md         # Документация по рефакторингу
```

## Использование

### Установка зависимостей

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