import { APIResponse } from "@playwright/test";

export interface ApiResponse<T = unknown> {
  /** Сырой ответ Playwright: статус, заголовки, повторное чтение тела */
  raw: APIResponse;
  /**
   * Разобранное тело ответа.
   * undefined, если тело пустое или не является корректным JSON —
   * в этом случае смотрите rawText
   */
  body: T;
  /** Тело ответа как текст: сохраняется даже если JSON.parse не удался */
  rawText: string;
  /** X-Correlation-Id текущего запроса — для поиска запроса в логах сервиса */
  correlationId: string;
  /** Длительность запроса, мс */
  durationMs: number;
}