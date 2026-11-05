/**
 * 
 * Реализация использует SSL_OP_LEGACY_SERVER_CONNECT для обхода ошибки
 * "unsafe legacy renegotiation disabled" при работе с серверами, требующими
 * legacy renegotiation (например, lc.preprod.mmk.local:8080).
 * 
 * Вся TLS-логика изолирована в этом классе, не влияя на глобальный TLS Node.js.
 */

import https from 'https';
import crypto from 'crypto';
import { randomUUID } from 'node:crypto';

/** Поддерживаемые HTTP-методы */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Интерфейс для ответа от API */
export interface ApiTransportResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body?: T;
  rawText: string;
  correlationId: string;
  durationMs: number;
}

/** Интерфейс транспорта для API запросов */
export interface ApiTransport {
  get<T>(url: string, headers?: Record<string, string>): Promise<ApiTransportResponse<T>>;
  post<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiTransportResponse<T>>;
  put<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiTransportResponse<T>>;
  patch<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiTransportResponse<T>>;
  delete<T>(url: string, headers?: Record<string, string>): Promise<ApiTransportResponse<T>>;
}

/**
 * Реализация транспорта через Node.js https.request()
 * 
 * Использует SSL_OP_LEGACY_SERVER_CONNECT для обхода проблем с legacy renegotiation.
 * Вся TLS логика изолирована в этом классе.
 */
export class NodeApiTransport implements ApiTransport {
  private readonly defaultTimeout: number;

  constructor(
    private readonly baseUrl: string,
    private readonly accessToken?: string,
    options?: { defaultTimeout?: number },
  ) {
    this.defaultTimeout = options?.defaultTimeout ?? 30000;
    
    if (!baseUrl) {
      throw new Error('NodeApiTransport: baseUrl не может быть пустым');
    }
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<ApiTransportResponse<T>> {
    return this.request<T>('GET', url, undefined, headers);
  }

  async post<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiTransportResponse<T>> {
    return this.request<T>('POST', url, body, headers);
  }

  async put<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiTransportResponse<T>> {
    return this.request<T>('PUT', url, body, headers);
  }

  async patch<T>(url: string, body?: unknown, headers?: Record<string, string>): Promise<ApiTransportResponse<T>> {
    return this.request<T>('PATCH', url, body, headers);
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<ApiTransportResponse<T>> {
    return this.request<T>('DELETE', url, undefined, headers);
  }

  /**
   * Выполняет HTTP запрос через Node.js https.request()
   * 
   * @param method - HTTP метод
   * @param url - URL (абсолютный или относительный)
   * @param body - Тело запроса (будет сериализовано в JSON)
   * @param headers - Дополнительные заголовки
   */
  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<ApiTransportResponse<T>> {
    const correlationId = randomUUID();
    const fullUrl = this.resolveUrl(url);
    const timeout = this.resolveTimeout(headers);

    const requestBody = body !== undefined ? JSON.stringify(body) : undefined;

    return new Promise<ApiTransportResponse<T>>((resolve, reject) => {
      const startTime = Date.now();

      const options: https.RequestOptions = {
        method,
        timeout,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId,
          ...(this.accessToken
            ? { Authorization: `Bearer ${this.accessToken}` }
            : {}),
          ...(body
            ? {
                'Content-Length': Buffer.byteLength(requestBody),
              }
            : {}),
          ...headers,
        },
        // TLS настройки для обхода legacy renegotiation
        // ВАЖНО: these are set ONLY in this class, not globally
        rejectUnauthorized: false,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      };

      const request = https.request(fullUrl, options, (response) => {
        const chunks: Buffer[] = [];
        const responseHeaders: Record<string, string> = {};

        // Собираем заголовки
        for (const [key, value] of Object.entries(response.headers)) {
          if (value !== undefined) {
            responseHeaders[key] = Array.isArray(value) ? value.join(', ') : String(value);
          }
        }

        response.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const durationMs = Date.now() - startTime;
          const responseBody = Buffer.concat(chunks).toString('utf-8');
          const normalizedBody = responseBody.replace(/^\uFEFF/, '');

          // Обработка ошибочных статусов
          if (response.statusCode !== undefined && response.statusCode >= 400) {
            reject(
              new Error(
                `${method} ${fullUrl} failed with status ${response.statusCode}: ${normalizedBody || '<empty>'}`,
              ),
            );
            return;
          }

          // Парсинг JSON с обработкой ошибок
          let parsedBody: T | undefined = undefined;
          if (normalizedBody) {
            try {
              parsedBody = JSON.parse(normalizedBody) as T;
            } catch (parseError) {
              reject(
                new Error(
                  `${method} ${fullUrl} returned invalid JSON: ${parseError instanceof Error ? parseError.message : String(parseError)} | Body: ${normalizedBody.substring(0, 500)}${normalizedBody.length > 500 ? '...' : ''}`,
                ),
              );
              return;
            }
          }

          resolve({
            status: response.statusCode ?? 200,
            headers: responseHeaders,
            body: parsedBody,
            rawText: normalizedBody,
            correlationId,
            durationMs,
          });
        });
      });

      request.on('error', (error) => {
        reject(
          new Error(
            `${method} ${fullUrl} network error: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      });

      request.on('timeout', () => {
        request.destroy();
        reject(
          new Error(
            `${method} ${fullUrl} timeout after ${timeout}ms`,
          ),
        );
      });

      if (requestBody) {
        request.write(requestBody);
      }

      request.end();
    });
  }

  /**
   * Разрешает относительный URL, добавляя baseUrl
   */
  private resolveUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const baseUrl = this.baseUrl.replace(/\/+$/, '');
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

    return `${baseUrl}${normalizedUrl}`;
  }

  /**
   * Извлекает таймаут из заголовков или использует дефолтный
   */
  private resolveTimeout(headers?: Record<string, string>): number {
    if (headers && headers['X-Request-Timeout']) {
      const timeout = parseInt(headers['X-Request-Timeout'], 10);
      if (!isNaN(timeout) && timeout > 0) {
        return timeout;
      }
    }
    return this.defaultTimeout;
  }
}

/**
 * Factory функция для создания NodeApiTransport
 * 
 * @param baseUrl - Базовый URL API
 * @param accessToken - Опциональный Bearer token
 * @param options - Опции транспорта
 */
export function nodeApiTransportFactory(
  baseUrl: string,
  accessToken?: string,
  options?: { defaultTimeout?: number },
): NodeApiTransport {
  return new NodeApiTransport(baseUrl, accessToken, options);
}
