import dotenv from 'dotenv';

// Загружаем .env файл
dotenv.config();

export interface TestConfig {
    baseUrl: string;
    apiKey: string;
    courtLawyerId: string;
    packageTypeId: string;
    testContractId: string;
    auth: {
        username: string;
        password: string;
    };
}

export const testConfig: TestConfig = {
    baseUrl: getRequiredEnv('BASE_URL'),
    apiKey: getRequiredEnv('API_KEY'),
    courtLawyerId: getRequiredEnv('COURT_LAWYER_ID'),
    packageTypeId: getRequiredEnv('PACKAGE_TYPE_ID'),
    testContractId: getRequiredEnv('TEST_CONTRACT_ID'),
    auth: {
        username: getRequiredEnv('ADMIN_USERNAME'),
        password: getRequiredEnv('ADMIN_PASSWORD'),
    }
};

function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
}

function getOptionalEnv(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
}

// Функции для получения конкретных значений
export const getBaseUrl = (): string => testConfig.baseUrl;
export const getApiKey = (): string => testConfig.apiKey;
export const getAuthCredentials = () => testConfig.auth;