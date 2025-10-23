draftAutoTests/
│
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions конфигурация
│
├── env_settings/
│   ├── .env.example            # Шаблон переменных окружения
│   ├── .env.test1              # Настройки для тестового окружения 1
│   └── .env.test2              # Настройки для тестового окружения 2
│
├── tests/
│   ├── auth/
│   │   └── login.spec.ts       # Тесты авторизации
│   ├── api-setup.ts            # Инициализация API-тестов
│   └── example.spec.ts         # Пример теста
│
├── API-Tests/                  # Автогенерируемая папка
│   └── storageState.json       # Сохраненное состояние сессии
│
├── playwright-report/          # Автогенерируемый отчет
│   ├── assets/
│   └── index.html              # HTML отчет
│
├── .gitignore                 # Игнорируемые файлы
├── package-lock.json          # Лок файл зависимостей
├── package.json               # Конфигурация проекта и скрипты
├── playwright.config.ts       # Основной конфиг Playwright
└── README.md                  # Документация проекта
