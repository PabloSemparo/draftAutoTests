# SSL Renegotiation Error Fix

## Проблема
При запуске API-тестов может возникать ошибка:
```
Error: apiRequestContext.post: write EPROTO AC490000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled
```

## Причина
Node.js по умолчанию отключает небезопасный legacy renegotiation для SSL/TLS. Некоторые серверы (например, `lc.preprod.mmk.local:8080`) требуют его для работы.

## Решения

### Решение 1: Обновление playwright.config.ts (Рекомендуется)

В конфигурации `playwright.config.ts` уже установлены следующие настройки:

```typescript
export default defineConfig({
  use: {
    ignoreHTTPSErrors: true,  // Игнорировать ошибки HTTPS для тестов
  },
  contextOptions: {
    ignoreHTTPSErrors: true,  // Игнорировать ошибки SSL для API запросов
  },
});
```

Это эквивалентно установке `NODE_TLS_REJECT_UNAUTHORIZED=0` на уровне Playwright.

⚠️ **ВАЖНО**: В текущей версии Playwright (v1.56.1) настройка `ignoreHTTPSErrors: true` в конфиге не всегда применяется к `APIRequestContext`. Это известное ограничение Playwright. Также не работает `npm set NODE_TLS_REJECT_UNAUTHORIZED=0` из-за того, что `npx` создаёт свой собственный процесс Node.js.

### Решение 2: Создание файла .env.local

Создайте файл `API-Tests/.env.local` в директории проекта:

```
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Если файл уже существует, убедитесь, что в нем есть эта строка.

**ВАЖНО**: Этот файл автоматически загружается Playwright через `playwright.config.ts`, но переменная окружения `NODE_TLS_REJECT_UNAUTHORIZED` должна быть установлена ДО запуска Node.js процесса. Это означает, что простая загрузка через `dotenv.config()` может быть недостаточной.

### Решение 3: Использование PowerShell скрипта (Рекомендуется для локальной разработки)

Создан PowerShell скрипт `API-Tests/run-tests.ps1`, который устанавливает переменную окружения и запускает тесты:

```powershell
# Запуск всех тестов
.\run-tests.ps1

# Запуск конкретного теста
.\run-tests.ps1 API-Tests/examples/contract-example.spec.ts

# Запуск с параметрами
.\run-tests.ps1 API-Tests/examples/contract-example.spec.ts --debug
```

⚠️ **ВАЖНО**: PowerShell скрипт правильно устанавливает переменную окружения, но из-за ограничений `npx`, переменная может не передаваться в дочерние процессы. В этом случае рекомендуется использовать решение 4.

### Решение 4: Запуск с переменной окружения напрямую

Для Windows используйте командную строку с явной установкой переменной окружения:

```cmd
set NODE_TLS_REJECT_UNAUTHORIZED=0 && npx playwright test API-Tests/examples/contract-example.spec.ts
```

Для PowerShell используйте:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; npx playwright test API-Tests/examples/contract-example.spec.ts
```

⚠️ **ВАЖНО**: Несмотря на установку переменной окружения, `npx` может не наследовать её в некоторых случаях. Это известная проблема с `npx` в Windows.

### Решение 5: Запуск через node без npx (Рекомендуется)

Используйте `node` напрямую, чтобы избежать проблем с наследованием переменных окружения:

```cmd
REM Windows (CMD)
set NODE_TLS_REJECT_UNAUTHORIZED=0 && node node_modules/.bin/playwright test API-Tests/examples/contract-example.spec.ts
```

```powershell
# Windows (PowerShell)
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; node node_modules/.bin/playwright test API-Tests/examples/contract-example.spec.ts
```

**Преимущества**:
- `node` наследует переменные окружения из родительского процесса
- Нет промежуточного процесса `npx`, который может сбрасывать переменные

### Решение 6: Запуск с флагом Node.js

```cmd
REM Windows (CMD)
node --tls-min-v1.0 node_modules/.bin/playwright test API-Tests/examples/contract-example.spec.ts
```

```powershell
# Windows (PowerShell)
node --tls-min-v1.0 node_modules/.bin/playwright test API-Tests/examples/contract-example.spec.ts
```

### Решение 7: Обновление конфигурации сервера (Рекомендуется для production)

Наиболее правильное решение - обновить конфигурацию сервера `lc.preprod.mmk.local:8080`, чтобы он поддерживал безопасный renegotiation. Это требует изменения настройки OpenSSL на сервере:

```
SSL.options=No Renegotiation
```

изменить на:

```
SSL.options=Renegotiation
```

или удалить эту опцию полностью (по умолчанию renegotiation разрешён в современных версиях OpenSSL).

## Безопасность
⚠️ **ВАЖНО**: Отключение проверки SSL-сертификатов небезопасно и должно использоваться только для локальной разработки или в изолированных средах. Для production сред настройте правильные SSL-сертификаты на серверах.

## Ограничение Playwright v1.56.1 и рекомендации

### Известное ограничение
В текущей версии Playwright (v1.56.1) настройка `ignoreHTTPSErrors: true` в конфиге и `APIRequestContext` **не работает** с ошибками SSL renegotiation. Это известное ограничение, связанное с тем, что:

1. `ignoreHTTPSErrors` отключает проверку SSL-сертификатов, но не влияет на параметры TLS-соединения (включая renegotiation)
2. Переменная окружения `NODE_TLS_REJECT_UNAUTHORIZED` должна быть установлена ДО запуска Node.js процесса
3. `npx`, `npm exec` и другие инструменты создают новые процессы Node.js, которые не наследуют переменные окружения из родительского процесса в Windows

### Рекомендации
1. **Для локальной разработки**: Используйте PowerShell скрипт `run-tests.ps1` с `env` файлом
2. **Для CI/CD**: Установите переменную окружения в настройках CI/CD (например, в GitHub Actions, GitLab CI)
3. **Для production**: Обновите конфигурацию сервера `lc.preprod.mmk.local:8080`, чтобы он поддерживал безопасный renegotiation

### Альтернативы
Если ни одно из решений не работает, рассмотрите:
1. Обновление Playwright до новой версии (в надежде, что проблема будет исправлена)
2. Использование прокси-сервера между тестами и сервером
3. Отключение SSL проверки на уровне операционной системы (не рекомендуется)

## Проверка
1. Создайте файл `API-Tests/.env.local` с содержимым `NODE_TLS_REJECT_UNAUTHORIZED=0`
2. Запустите тест через `node` (не `npx`):
   ```cmd
   set NODE_TLS_REJECT_UNAUTHORIZED=0 && node node_modules/.bin/playwright test API-Tests/examples/contract-example.spec.ts
   ```
3. Тест должен пройти без ошибок SSL