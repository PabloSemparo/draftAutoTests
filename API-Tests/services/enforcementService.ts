import { ApiClient } from "../utils/apiClient";
import { ApiResponse } from "../utils/apiResponse";
import { EnforcementEventsResponse } from "../models/enforcementEvents";

export class EnforcementService extends ApiClient {

  /**
   * Получить список доступных событий
   * для указанного состояния исполнительного производства
   */
  async getAvailableEvents(
    state: string
  ): Promise<ApiResponse<EnforcementEventsResponse>> {

    return this.get<EnforcementEventsResponse>({
      url: "https://eq-legal-collection-stage.bdengi.ru/v1/enforcements/events",
      params: {
        state
      }
    });
  }

}