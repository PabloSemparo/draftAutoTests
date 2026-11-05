/**
 * Service layer для eq-dc-court
 */

import type { APIRequestContext } from "@playwright/test";

import { apiConfig, requireBaseUrl, requireSecret } from "../config/apiConfig";
import { ApiClient, ApiClientOptions } from "../utils/apiClient";
import { ApiResponse } from "../utils/apiResponse";
import {
  BankruptCheckParams,
  BankruptCheckResponse,
  CourtSearchItem,
  CourtSearchResponse,
} from "../models/dcCourt";

import { getValidBankruptCheckParams, getValidCourtSearchItem } from "../fixtures/dcCourt";

interface DcCourtServiceOptions extends ApiClientOptions {
  requireAuth?: boolean;
}

export class DcCourtService extends ApiClient {
  constructor(
    request: APIRequestContext,
    options: DcCourtServiceOptions = {}
  ) {
    const requireAuth = options.requireAuth ?? true;
    const apiKey = requireAuth
      ? requireSecret(apiConfig.eqDcCourt.apiKey, "EQ_DC_COURT_API_KEY", "eq-dc-court")
      : options.apiKey;

    super(request, {
      baseUrl: requireBaseUrl(apiConfig.eqDcCourt.baseUrl, "EQ_DC_COURT_BASE_URL", "eq-dc-court"),
      apiKey,
      apiKeyHeaderName: "X-API-KEY",
      token: options.token ?? apiConfig.eqDcCourt.token,
      ...options,
    });
  }

  async checkBankrupt(
    params: BankruptCheckParams
  ): Promise<ApiResponse<BankruptCheckResponse>> {
    return this.get<BankruptCheckResponse>({
      url: "/v1/bankrupts/check",
      params: toQueryParams(params),
    });
  }

  async searchCourts(address: string): Promise<ApiResponse<CourtSearchItem[]>> {
    return this.get<CourtSearchItem[]>({
      url: "/v1/courts/search",
      params: { address },
    });
  }

  // === Методы с использованием фикстур ===

  /**
   * Создание параметров проверки банкротства с использованием фикстур
   */
  getTestBankruptCheckParams(overrides: Record<string, unknown> = {}): BankruptCheckParams {
    return getValidBankruptCheckParams(overrides);
  }

  /**
   * Создание параметров проверки по ИНН
   */
  getBankruptCheckByInn(inn: string): BankruptCheckParams {
    return getValidBankruptCheckParams({ inn });
  }

  /**
   * Создание параметров проверки по ФИО
   */
  getBankruptCheckByFio(fio: string): BankruptCheckParams {
    return getValidBankruptCheckParams({ fio });
  }

  /**
   * Создание параметров проверки по ИНН и ФИО
   */
  getBankruptCheckByInnAndFio(inn: string, fio: string): BankruptCheckParams {
    return getValidBankruptCheckParams({ inn, fio });
  }

  /**
   * Создание фиктивного элемента поиска судов
   */
  getTestCourtSearchItem(overrides: Partial<Record<string, unknown>> = {}): CourtSearchItem {
    return getValidCourtSearchItem(overrides) as unknown as CourtSearchItem;
  }
}

function toQueryParams(
  params: BankruptCheckParams
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean>;
}
