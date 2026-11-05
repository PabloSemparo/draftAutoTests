/**
 * Утилита для создания APIRequestContext с правильными настройками SSL
 * 
 * Использование:
 * import { createAPIRequestContext } from '../test-utils/apiContext';
 * 
 * const request = await createAPIRequestContext();
 * const response = await request.post(url, { data: body });
 */

import type { APIRequestContext } from '@playwright/test';
import { request as playwrightRequest } from '@playwright/test';

/**
 * Создает APIRequestContext с игнорированием ошибок SSL
 * 
 * @returns Promise<APIRequestContext> - Контекст для API запросов
 */
export async function createAPIRequestContext(): Promise<APIRequestContext> {
  return await playwrightRequest.newContext({
    ignoreHTTPSErrors: true,
  });
}

/**
 * Создает APIRequestContext с базовым URL и игнорированием ошибок SSL
 * 
 * @param baseURL - Базовый URL для запросов
 * @returns Promise<APIRequestContext> - Контекст для API запросов
 */
export async function createAPIRequestContextWithBaseURL(baseURL: string): Promise<APIRequestContext> {
  return await playwrightRequest.newContext({
    baseURL,
    ignoreHTTPSErrors: true,
  });
}

export default {
  createAPIRequestContext,
  createAPIRequestContextWithBaseURL,
};