# API Tests

## Структура проекта

```
API-Tests/
├── fixtures/              # Централизованные фикстуры тестовых данных
│   ├── index.ts
│   ├── types.ts
│   ├── contract.ts        # Фикстуры для договоров (Contracts)
│   ├── dcCourt.ts
│   ├── debtCollection.ts
│   ├── debtImporter.ts
│   └── eq-dc/             # Фикстуры для eq-debt-collection
├── test-utils/            # Централизованные утилиты тестирования
│   ├── index.ts
│   ├── contract-utils.ts  # Утилиты для работы с договорами
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
├── examples/              # Примеры использования утилит
│   ├── contract-example.spec.ts
│   └── simple-contract.spec.ts
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
import { getValidDebtPackage, getValidContractorPayload, getValidContractPayload } from '../fixtures';

const package = getValidDebtPackage();
const contractor = getValidContractorPayload({ status: 'ACTIVE' });
const contractData = getValidContractPayload({ 
    companyId: "123",
    loanAmount: 100000 
});
```

### Утилиты

```typescript
import { BaseTestUtils, PackageAssertions } from '../test-utils';

await BaseTestUtils.setupAllure('Feature', 'Story', 'Description');
BaseTestUtils.validatePackageResponseStructure(responseBody);
```

### Работа с договорами (Contracts)

```typescript
import { createContract, getGlobalContractId, setGlobalContractId, ContractUtils } from '../test-utils';

// Создание договора и получение его ID
const contractId = await createContract(request, {
    companyId: "123",
    contractNumber: "TEST-001",
    loanAmount: 100000
});

// Получение ID из глобальной переменной CONTRACT
const savedContractId = getGlobalContractId();

// Установка ID в глобальную переменную
setGlobalContractId(contractId);

// Использование ContractUtils
await ContractUtils.createContract(request, contractData);
const id = ContractUtils.getGlobalContractId();
```

### Использование фикстур для генерации данных договора

```typescript
import { getValidContractPayload, getInvalidContractPayload, getEmptyContractPayload } from '../fixtures';

// Валидные данные для создания договора
const validContractData = getValidContractPayload({
    companyId: "123",
    loanAmount: 100000
});

// Невалидные данные для тестов валидации
const invalidContractData = getInvalidContractPayload({
    loanAmount: -100  // Переопределяем поле
});

// Пустые данные для тестов без тела запроса
const emptyContractData = getEmptyContractPayload();
```

### Конфигурация

```typescript
import { apiConfig } from '../config/apiConfig';
const baseUrl = apiConfig.eqDebtCollection.baseUrl;
```

## Примеры использования

### Создание договора с глобальной переменной CONTRACT

```typescript
import { test, expect } from '@playwright/test';
import { createContract, getGlobalContractId } from '../test-utils';

test('Создать договор и использовать его ID', async ({ request }) => {
    // Создаем договор
    const contractId = await createContract(request, {
        companyId: "123",
        contractNumber: "TEST-001",
        loanAmount: 100000
    });
    
    // ID сохранен в глобальной переменной CONTRACT
    const savedId = getGlobalContractId();
    expect(savedId).toBe(contractId);
});
```

### Использование фикстур для генерации данных

```typescript
import { getValidContractPayload } from '../fixtures';

const contractData = getValidContractPayload({
    companyId: "123",
    loanAmount: 100000
});
```

### Создание договора с кастомизированными полями

```typescript
import { test, expect } from '@playwright/test';
import { createContract, getValidContractPayload } from '../test-utils';
import { getValidContractPayload as getContractFixture } from '../fixtures';

test('Создать договор с кастомизированными полями', async ({ request }) => {
    // Используем фикстуру для получения валидных данных
    const contractData = getContractFixture({
        companyId: "custom-company-id",
        contractNumber: "CUSTOM-001",
        loanAmount: 500000
    });
    
    // Создаем договор
    const contractId = await createContract(request, contractData);
    
    // Проверяем, что ID сохранен
    expect(getGlobalContractId()).toBe(contractId);
});
```

Больше примеров смотрите в `examples/contract-example.spec.ts` и `examples/simple-contract.spec.ts`.