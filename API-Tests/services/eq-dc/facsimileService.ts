/**
 * Service layer для Facsimile API (eq-debt-collection)
 */

import type { APIRequestContext } from '@playwright/test';
import { apiConfig, requireBaseUrl, requireSecret } from '../../config/apiConfig';
import { ApiClient, ApiClientOptions } from '../../utils/apiClient';
import { ApiResponse } from '../../utils/apiResponse';
import {
  FacsimileDetailDtoRs,
  FacsimileCreateUpdateDtoRq,
  FacsimileListResponse,
  FacsimileCreateDtoRs,
  ErrorDtoRs,
} from '../../models/eq-dc/facsimile';

interface FacsimileServiceOptions extends ApiClientOptions {
  requireAuth?: boolean;
}

export class FacsimileService extends ApiClient {
  constructor(
    request: APIRequestContext,
    options: FacsimileServiceOptions = {}
  ) {
    const requireAuth = options.requireAuth ?? true;

    super(request, {
      baseUrl: requireBaseUrl(apiConfig.eqDebtCollection.baseUrl, 'EQ_DEBT_COLLECTION_BASE_URL', 'eq-debt-collection'),
      token: requireAuth
        ? requireSecret(apiConfig.eqDcCourt.token, 'AUTH_TOKEN', 'eq-debt-collection')
        : options.token,
      ...options,
    });
  }

  /**
   * Получить список всех факсимиле
   */
  async getFacsimiles(
    params: Record<string, string | number | boolean> = { pageNumber: 0, pageSize: 25 }
  ): Promise<ApiResponse<FacsimileListResponse>> {
    return this.get<FacsimileListResponse>({
      url: '/api/v1/facsimiles',
      params,
    });
  }

  /**
   * Получить факсимиле по ID
   */
  async getFacsimileById(id: string): Promise<ApiResponse<FacsimileDetailDtoRs>> {
    return this.get<FacsimileDetailDtoRs>({
      url: `/api/v1/facsimiles/${id}`,
    });
  }

  /**
   * Создать новое факсимиле
   */
  async createFacsimile(payload: FacsimileCreateUpdateDtoRq): Promise<ApiResponse<FacsimileCreateDtoRs>> {
    return this.post<FacsimileCreateDtoRs>({
      url: '/api/v1/facsimiles',
      body: payload,
    });
  }

  /**
   * Обновить факсимиле по ID
   */
  async updateFacsimile(id: string, payload: FacsimileCreateUpdateDtoRq): Promise<ApiResponse<unknown>> {
    return this.put<unknown>({
      url: `/api/v1/facsimiles/${id}`,
      body: payload,
    });
  }

  /**
   * Удалить факсимиле по ID
   */
  async deleteFacsimile(id: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>({
      url: `/api/v1/facsimiles/${id}`,
    });
  }

  /**
   * Upsert факсимиле по ID юриста (если есть - обновить, если нет - создать)
   */
  async upsertFacsimileByLawyerId(lawyerId: string, payload: FacsimileCreateUpdateDtoRq): Promise<ApiResponse<unknown>> {
    return this.put<unknown>({
      url: `/api/v1/facsimiles/lawyer/${lawyerId}`,
      body: payload,
    });
  }

  /**
   * Обработка ошибок
   */
  protected handleErrorResponse(response: any): ErrorDtoRs {
    return {
      status: {
        code: response.status?.code || 'UNKNOWN_ERROR',
        description: response.status?.description || 'Неизвестная ошибка',
      },
      errors: response.errors,
      details: response.details,
    };
  }
}