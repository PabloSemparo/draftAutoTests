/**
 * Константы и конфигурация для OpenAPI тестов eq-debt-collection
 */

export const TEST_CONSTANTS = {
  VALID_PACKAGE_ID: '01a0f250-ca19-74c9-8820-a5dbad7c0101',
  VALID_FACSIMILE_ID: '019a6df0-3d83-7a78-9847-70aed4c7feag',
  VALID_LAWYER_ID: '9456857c-7e26-4d4e-8cf1-a2f4326d2c5e',
  VALID_COURT_LAWYER_ID: '9456857c-7e26-4d4e-8cf1-a2f4326d2c5e',
  VALID_PACKAGE_TYPE_ID: '6dd257e6-d05c-4019-97cb-eb08dbe17292',
  VALID_CONTRACT_ID: '00004a4d-358e-46e5-8ac5-33a4956f33b0',
  VALID_CONTRACT_COURT_LAWYER_ID: '1f6b2442-ded3-4ffb-b287-07b34614a307',
  BASE_URL: 'https://eq-debt-collection-stage.bdengi.ru',
} as const;

export const TEST_CONFIG = {
  RESPONSE_TIME: {
    NORMAL: 5000,
    FAST: 2000,
    VERY_FAST: 500,
  },
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  STATUS_TEXTS: {
    SUCCESS: 'SUCCESS',
    CREATED: 'CREATED',
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  },
  ERROR_DESCRIPTIONS: {
    BAD_REQUEST: 'Некорректный формат запроса',
    UNAUTHORIZED: 'Токен авторизации не указан или неверный',
    FORBIDDEN: 'Недостаточно прав для выполнения операции',
    NOT_FOUND: 'Запрошенный ресурс не найден',
    VALIDATION_ERROR: 'Ошибка валидации входных данных',
    SERVER_ERROR: 'Внутренняя ошибка сервера',
  },
} as const;

export const TEST_PAYLOADS = {
  VALID_PACKAGE_PAYLOAD: {
    typeId: '019a6df0-3d83-7a78-9847-70aed4c7feaj',
    statusCode: 'ACTIVE',
    includedContracts: ['019a6df0-3d83-7a78-9847-70aed4c7feak'],
  },
  VALID_FACSIMILE_PAYLOAD: {
    lawyerId: '019a6df0-3d83-7a78-9847-70aed4c7feal',
    content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    fileName: 'facsimile.png',
    contentType: 'image/png',
    fileSize: 1024,
  },
} as const;

export const TEST_HEADERS = {
  ACCEPT_JSON: { Accept: 'application/json' },
  CONTENT_TYPE_JSON: { 'Content-Type': 'application/json' },
} as const;