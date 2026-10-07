import type { APIRequestContext } from "@playwright/test";

import { ApiClient, ApiClientOptions } from "../utils/apiClient";
import { ApiResponse } from "../utils/apiResponse";
import { EnforcementEventsResponse } from "../models/enforcementEvents";

/**
 * Путь относительно BASE_URL (см. playwright.config.ts) —
 * хост окружения больше не хардкодится в сервисе
 */
const EVENTS_PATH = "/v1/enforcements/events";

export class EnforcementService extends ApiClient {

  constructor(
    request: APIRequestContext,
    options: ApiClientOptions = {}
  ) {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error(
        [
          "Не задан API_KEY для eq-legal-collection.",
          "Эндпоинт /v1/enforcements/events защищён API-ключом",
          "(security: apiKeyAuth, заголовок x-api-key — см. /v3/api-docs).",
          "Добавьте API_KEY=<ключ> в env_settings/.env.stage",
          "или задайте переменную окружения API_KEY в CI.",
        ].join(" ")
      );
    }

    super(request, {
      baseUrl: process.env.BASE_URL,
      apiKey,
      ...options,
    });
  }

  /**
   * Получить список доступных событий
   * для указанного состояния исполнительного производства
   */
  async getAvailableEvents(
    state: string
  ): Promise<ApiResponse<EnforcementEventsResponse>> {

    return this.get<EnforcementEventsResponse>({
      url: EVENTS_PATH,
      params: {
        state
      }
    });
  }

}