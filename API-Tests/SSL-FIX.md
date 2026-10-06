# SSL Renegotiation Error Fix

## Проблема
При запуске API-тестов может возникать ошибка:
```
Error: apiRequestContext.post: write EPROTO AC490000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled
```

## Причина
Node.js по умолчанию отключает небезопасный legacy renegotiation для SSL/TLS. Некоторые серверы (например, `lc.preprod.mmk.local:8080`) требуют его для работы.

## Решения

### Решение 1: Запуск с переменной окружения (Рекомендуется)

```bash
# Windows (PowerShell)
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; npx playwright test API-Tests/examples/contract-example.spec.ts

# Windows (CMD)
set NODE_TLS_REJECT_UNAUTHORIZED=0 && npx playwright test API-Tests/examples/contract-example.spec.ts

# Linux/Mac
NODE_TLS_REJECT_UNAUTHORIZED=0 npx playwright test API-Tests/examples/contract-example.spec.ts
```

### Решение 2: Запуск с флагом Node.js

```bash
# Windows (PowerShell)
node --tls-min-v1.0 $(which npx) playwright test API-Tests/examples/contract-example.spec.ts

# Или через node_modules
node --tls-min-v1.0 ./node_modules/.bin/playwright test API-Tests/examples/contract-example.spec.ts
```

### Решение 3: Для CI/CD

Добавьте в конфигурацию CI/CD переменную окружения:
```
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### Решение 4: Для локальной разработки

Создайте файл `API-Tests/.env.local`:
```
NODE_TLS_REJECT_UNAUTHORIZED=0
```

И запускайте через скрипт:
```bash
npx playwright test
```

## Безопасность
⚠️ **ВАЖНО**: Отключение проверки SSL-сертификатов небезопасно и должно использоваться только для локальной разработки или в изолированных средах. Для production сред настройте правильные SSL-сертификаты на серверах.

## Проверка
После настройки переменной окружения запустите тест:
```bash
npx playwright test API-Tests/examples/contract-example.spec.ts
```

Тест должен пройти без ошибок SSL.