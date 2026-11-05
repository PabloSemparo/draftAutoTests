// tests/shared/types.ts
export interface ApiResponse {
    status: {
        code: string;
        description: string;
    };
    errors?: ApiError[];
    details?: any;
}

export interface ApiError {
    key: string;
    code: string;
    description: string;
}

export interface PackageResponse {
    id: string;
    number: number;
    typeId: string;
    statusCode: string;
    createdAt: string;
    responsibleLawyerId: string;
    includedContracts: string[];
}

export const TEST_CONSTANTS = {
    VALID_PACKAGE_ID: '019a6df0-3d83-7a78-9847-70aed4c7feaf',
    BASE_URL: process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru'
} as const;

export const TEST_CONFIG = {
    RESPONSE_TIME: {
        NORMAL: 5000,
        FAST: 2000,
        VERY_FAST: 500
    },
    STATUS_CODES: {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        VALIDATION_ERROR: 422,
        SERVER_ERROR: 500
    },
    STATUS_TEXTS: {
        BAD_REQUEST: 'BAD_REQUEST',
        VALIDATION_ERROR: 'VALIDATION_ERROR'
    },
    ERROR_DESCRIPTIONS: {
        BAD_REQUEST: 'Некорректный формат запроса'
    }
} as const;