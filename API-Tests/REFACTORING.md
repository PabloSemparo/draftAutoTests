# API Tests - Рефакторинг и Улучшения

## Обновленная архитектура (2024)

После глубокого анализа кодовой базы были выявлены и устранены следующие проблемы:

### 🔍 Ключевые проблемы

1. **Дублирование тестовых данных** - статические JSON и inline-объекты в каждом тесте
2. **Множественные копии `test-utils.ts`** - 6+ идентичных файлов с ~400+ строк дубликатов
3. **Отсутствие централизованного управления Allure** - дублирование декораторов и хелперов
4. **Нет конфигурации Playwright** - отсутствие `playwright.config.ts` и путей запуска
5. **Тонкий слой сервисов** - отсутствие общих логик (аутентификация, retry, обработка ошибок)

### ✅ Решения

#### 2. **Централизованные утилиты** (`API-Tests/test-utils/`)

Созданы базовые утилиты для всех тестов:

```
test-utils/
├── index.ts                  # Централизованный экспорт
├── base-test-utils.ts       # Базовый класс с методами валидации
├── assertions.ts            # Доменно-специфичные ассерты
├── allure-config.ts         # Конфигурация Allure
└── boundary-values.ts       # Генерация граничных значений
```

**Пример использования:**

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

// Ассерты для пакетов
PackageAssertions.validatePackageResponseStructure(responseBody);
```

#### 4. **Улучшенные сервисы**

Обновленные сервисы используют фикстуры для создания тестовых данных:

```typescript
import { DebtImporterService } from '../services/debtImporterService';

// Создание контрактора с фикстурами
const response = await service.createTestContractor({ status: 'ACTIVE' });

// Создание импорта с кастомными директориями
const importResponse = await service.createContractImportWithDirectories(
  contractorId,
  { contractDirectory: '/custom/path/' }
);
```

#### 5. **Обновленные скрипты package.json**

```json
{
  "scripts": {
    "test:api": "playwright test -c API-Tests/playwright.config.ts",
    "test:api:ui": "playwright test -c API-Tests/playwright.config.ts --ui",
    "test:api:debug": "playwright test -c API-Tests/playwright.config.ts --debug",
    "test:api:legal": "playwright test -c API-Tests/playwright.config.ts API-Tests/tests/eq-legal-collection",
    "test:api:dc-court": "playwright test -c API-Tests/playwright.config.ts API-Tests/tests/eq-dc-court",
    "test:api:debt-importer": "playwright test -c API-Tests/playwright.config.ts API-Tests/tests/eq-dc-debt-importer",
    "test:api:debt-collection": "playwright test -c API-Tests/playwright.config.ts API-Tests/tests/eq-debt-collection",
    "test:report": "playwright test && allure generate ... && allure open ...",
    "typecheck": "tsc --noEmit -p tsconfig.api.json"
  }
}
```

### 📋 Использование

#### Импорт фикстур

```typescript
import {
  getValidDebtPackage,
  getValidDebtData,
  getValidContract,
  getValidContractorPayload,
  getValidCourtSearchItem,
} from '../fixtures';
```

#### Импорт утилит

```typescript
import {
  BaseTestUtils,
  CustomMatchers,
  PackageAssertions,
  CourtAssertions,
  DebtImporterAssertions,
  boundaryValues,
} from '../test-utils';
```

#### Импорт конфигурации

```typescript
import { apiConfig } from '../config/apiConfig';
import { Allure } from '../utils/allure-decorators';
```

### 🚀 Миграция существующих тестов

Для миграции тестов под новую архитектуру:

1. **Замените inline-объекты на фикстуры:**

```typescript
// До
const package = {
  id: faker.string.uuid(),
  number: faker.number.int({ min: 100000, max: 999999 }),
  // ...
};

// После
import { getValidDebtPackage } from '../fixtures';
const package = getValidDebtPackage();
```

2. **Используйте централизованные утилиты:**

```typescript
// До
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// После
import { BaseTestUtils, PackageAssertions } from '../test-utils';
```

3. **Обновите конфигурацию:**

```typescript
// До
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// После
import { apiConfig } from '../config/apiConfig';
const baseUrl = apiConfig.eqDebtCollection.baseUrl;
```

### 📁 Структура файлов

```
API-Tests/
├── fixtures/                  # НОВОЕ: Централизованные фикстуры
│   ├── index.ts
│   ├── types.ts
│   ├── debtImporter.ts
│   ├── debtCollection.ts
│   └── dcCourt.ts
├── test-utils/                # НОВОЕ: Централизованные утилиты
│   ├── index.ts
│   ├── base-test-utils.ts
│   ├── assertions.ts
│   ├── allure-config.ts
│   └── boundary-values.ts
├── config/
│   └── apiConfig.ts          # Улучшено: Типизированная конфигурация
├── utils/
│   ├── allure-decorators.ts  # Улучшено: Централизованные декораторы
│   └── allure-helpers.ts     # Улучшено: Вспомогательные функции
├── services/
│   └── debtImporterService.ts # Улучшено: Использует фикстуры
├── models/                    # Без изменений
├── tests-data/                # Без изменений
└── tests/
    ├── eq-legal-collection/
    ├── eq-dc-court/
    ├── eq-dc-debt-importer/
    └── eq-debt-collection/
```

### 🎯 Преимущества

1. **DRY принцип** - нет дублирования кода
2. **Унификация** - одинаковый подход ко всем тестам
3. **Поддержка** - легко менять тестовые данные в одном месте
4. **Читаемость** - тесты становятся чище и понятнее
5. **Типизация** - TypeScript поддержка для всех фикстур
6. **Расширяемость** - легко добавлять новые фикстуры и утилиты

### 🔄 Продолжение работы

Рекомендуется постепенно мигрировать существующие тесты под новую архитектуру:

1. Мигрировать тестовые данные в фикстуры
2. Заменить дублирующиеся test-utils на базовые утилиты
3. Обновить Allure декораторы
4. Добавить миграционные скрипты для автоматизации

### 📚 Дополнительная документация

- [API-Tests README](API-Tests/README.md)
- [Паттерны тестирования](API-Tests/PATTERN.md)