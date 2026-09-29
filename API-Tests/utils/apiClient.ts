import type {
  APIRequestContext,
  APIResponse,
} from "@playwright/test";
import { randomUUID } from "node:crypto";
import { ApiRequest } from "./apiRequest";
import { ApiResponse as ClientResponse } from "./apiResponse";

/** Поддерживаемые HTTP-методы */
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export interface ApiClientOptions {
  /** Базовый адрес окружения, например process.env.BASE_URL */
  baseUrl?: string;
  /** API-ключ: отправляется в заголовке apiKeyHeaderName */
  apiKey?: string;
  /** Имя заголовка для API-ключа (по умолчанию x-api-key) */
  apiKeyHeaderName?: string;
  /** Токен: отправляется как Authorization: Bearer <token> */
  token?: string;
  /** Подробное логирование (по умолчанию process.env.API_DEBUG === "true") */
  debug?: boolean;
  /** Таймаут запроса по умолчанию, мс */
  defaultTimeout?: number;
}

export class ApiClient {
  protected readonly baseUrl: string;
  protected readonly apiKey?: string;
  protected readonly token?: string;
  protected readonly debug: boolean;

  private readonly apiKeyHeaderName: string;
  private readonly defaultTimeout: number;

  constructor(
    protected readonly request: APIRequestContext,
    options: ApiClientOptions = {}
  ) {
    this.baseUrl = (options.baseUrl ?? "").replace(/\/+$/, "");
    this.apiKey = options.apiKey;
    this.token = options.token;
    this.apiKeyHeaderName =
      options.apiKeyHeaderName ?? "x-api-key";
    this.debug =
      options.debug ?? process.env.API_DEBUG === "true";
    this.defaultTimeout = options.defaultTimeout ?? 30000;
  }

  protected async get<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("GET", data);
  }

  protected async post<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("POST", data);
  }

  protected async put<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("PUT", data);
  }

  protected async patch<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("PATCH", data);
  }

  protected async delete<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("DELETE", data);
  }

  /** Абсолютный URL используется как есть, относительный склеивается с baseUrl */
  private resolveUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    if (!this.baseUrl) {
      throw new Error(
        `ApiClient: получен относительный url "${url}", но baseUrl не задан`
      );
    }

    return `${this.baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  /** Секреты не должны попадать в логи */
  private maskHeaders(
    headers: Record<string, string>
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers).map(function ([name, value]) {
        return [
          name,
          /^(authorization|x-api-key)$/i.test(name) ? "***" : value,
        ];
      })
    );
  }

  protected async send<T>(
    method: HttpMethod,
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    const url = this.resolveUrl(data.url);
    const correlationId =
      data.headers?.["X-Correlation-Id"] ?? randomUUID();

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Correlation-Id": correlationId,
      ...(this.apiKey
        ? { [this.apiKeyHeaderName]: this.apiKey }
        : {}),
      ...(this.token
        ? { Authorization: `Bearer ${this.token}` }
        : {}),
      ...data.headers,
    };

    if (this.debug) {
      console.log("\n========================================");
      console.log(`${method} ${url}`);
      console.log("Headers:", this.maskHeaders(headers));

      if (data.params) {
        console.log("Query Params:", data.params);
      }

      if (data.body) {
        console.log(
          "Request Body:",
          JSON.stringify(data.body, null, 2)
        );
      }
    }

    const started = Date.now();

    const response: APIResponse = await this.request.fetch(url, {
      method,
      headers,
      params: data.params,
      data: data.body,
      timeout: data.timeout ?? this.defaultTimeout,
    });

    const durationMs = Date.now() - started;

    // Тело читаем как текст: содержимое не теряется при не-JSON ответе,
    // а rawText всегда доступен вызывающему коду
    const rawText = await response.text();

    let body: T | undefined;

    if (rawText) {
      try {
        body = JSON.parse(rawText) as T;
      } catch {
        body = undefined;
      }
    }

    if (this.debug) {
      console.log(`X-Correlation-Id: ${correlationId}`);
      console.log(`Status: ${response.status()}`);
      console.log(`Time: ${durationMs} ms`);
      console.log("Response:");
      console.log(
        body === undefined
          ? rawText || "<empty body>"
          : JSON.stringify(body, null, 2)
      );
      console.log("========================================\n");
    }

    return {
      raw: response,
      body: body as T,
      rawText,
      correlationId,
      durationMs,
    };
  }
}