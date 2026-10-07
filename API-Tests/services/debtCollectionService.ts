/**
 * Service layer для eq-debt-collection
 */

import type { APIRequestContext } from "@playwright/test";

import { apiConfig, requireBaseUrl, requireSecret } from "../config/apiConfig";
import { ApiClient, ApiClientOptions } from "../utils/apiClient";
import { ApiResponse } from "../utils/apiResponse";
import {
  PackageListResponse,
  PackagePayload,
  PackageResponse,
  PackageStatusUpdatePayload,
} from "../models/debtCollection";

import { getValidDebtPackage } from "../fixtures/debtCollection";

interface DebtCollectionServiceOptions extends ApiClientOptions {
  requireAuth?: boolean;
}

export class DebtCollectionService extends ApiClient {
  constructor(
    request: APIRequestContext,
    options: DebtCollectionServiceOptions = {}
  ) {
    const requireAuth = options.requireAuth ?? true;

    super(request, {
      baseUrl: requireBaseUrl(apiConfig.eqDebtCollection.baseUrl, "EQ_DEBT_COLLECTION_BASE_URL", "eq-debt-collection"),
      token: requireAuth
        ? requireSecret(apiConfig.eqDcCourt.token, "AUTH_TOKEN", "eq-debt-collection")
        : options.token,
      ...options,
    });
  }

  async getPackages(
    params: Record<string, string | number | boolean> = { pageNumber: 0, pageSize: 25 }
  ): Promise<ApiResponse<PackageListResponse>> {
    return this.get<PackageListResponse>({
      url: "/api/v1/packages",
      params,
    });
  }

  async createPackage(
    payload: PackagePayload
  ): Promise<ApiResponse<PackageResponse>> {
    return this.post<PackageResponse>({
      url: "/api/v1/packages",
      body: payload,
    });
  }

  async getPackageById(id: string): Promise<ApiResponse<PackageResponse>> {
    return this.get<PackageResponse>({
      url: `/api/v1/packages/${id}`,
    });
  }

  async updatePackageStatus(
    id: string,
    payload: PackageStatusUpdatePayload
  ): Promise<ApiResponse<PackageResponse>> {
    return this.patch<PackageResponse>({
      url: `/api/v1/packages/${id}/status`,
      body: payload,
    });
  }

  async updatePackage(
    id: string,
    payload: PackagePayload
  ): Promise<ApiResponse<PackageResponse>> {
    return this.put<PackageResponse>({
      url: `/api/v1/packages/${id}`,
      body: payload,
    });
  }

  async deletePackage(id: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>({
      url: `/api/v1/packages/${id}`,
    });
  }

  // === Методы с использованием фикстур ===

  /**
   * Создание тестового пакета с использованием фикстур
   */
  async createTestPackage(overrides: Partial<Record<string, unknown>> = {}): Promise<ApiResponse<PackageResponse>> {
    const payload = getValidDebtPackage(overrides) as unknown as PackagePayload;
    return this.createPackage(payload);
  }

  /**
   * Создание пакета с определенным статусом
   */
  async createPackageWithStatus(statusCode: string): Promise<ApiResponse<PackageResponse>> {
    return this.createTestPackage({ statusCode });
  }

  /**
   * Создание пакета с конкретными контрактами
   */
  async createPackageWithContracts(contractIds: string[]): Promise<ApiResponse<PackageResponse>> {
    return this.createTestPackage({ includedContracts: contractIds });
  }
}

