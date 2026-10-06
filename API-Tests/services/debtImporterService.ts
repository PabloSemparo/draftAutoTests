/**
 * Service layer для eq-dc-debt-importer с фикстурами
 */

import type { APIRequestContext } from "@playwright/test";

import { apiConfig, requireBaseUrl, requireSecret } from "../config/apiConfig";
import { ApiClient, ApiClientOptions } from "../utils/apiClient";
import { ApiResponse } from "../utils/apiResponse";
import {
  ContractImportListResponse,
  ContractImportPayload,
  ContractImportResponse,
  ContractListResponse,
  ContractorListResponse,
  ContractorPayload,
  ContractorResponse,
} from "../models/debtImporter";

import { getValidContractorPayload, getValidContractImportPayload } from "../fixtures/debtImporter";

interface DebtImporterServiceOptions extends ApiClientOptions {
  requireAuth?: boolean;
}

export class DebtImporterService extends ApiClient {
  constructor(
    request: APIRequestContext,
    options: DebtImporterServiceOptions = {}
  ) {
    const requireAuth = options.requireAuth ?? true;

    super(request, {
      baseUrl: requireBaseUrl(apiConfig.eqDcDebtImporter.baseUrl, "EQ_DC_DEBT_IMPORTER_BASE_URL", "eq-dc-debt-importer"),
      token: requireAuth
        ? requireSecret(apiConfig.eqDcDebtImporter.token, "AUTH_TOKEN", "eq-dc-debt-importer")
        : options.token,
      ...options,
    });
  }

  async getContractors(
    params: Record<string, string | number | boolean> = { pageNumber: 0, pageSize: 25 }
  ): Promise<ApiResponse<ContractorListResponse>> {
    return this.get<ContractorListResponse>({
      url: "/admin/v1/contractors",
      params,
    });
  }

  async createContractor(
    payload: ContractorPayload
  ): Promise<ApiResponse<ContractorResponse>> {
    return this.post<ContractorResponse>({
      url: "/admin/v1/contractors",
      body: payload,
    });
  }

  async getContractorById(id: string): Promise<ApiResponse<ContractorResponse>> {
    return this.get<ContractorResponse>({
      url: `/admin/v1/contractors/${id}`,
    });
  }

  async updateContractor(
    id: string,
    payload: ContractorPayload
  ): Promise<ApiResponse<ContractorResponse>> {
    return this.put<ContractorResponse>({
      url: `/admin/v1/contractors/${id}`,
      body: payload,
    });
  }

  async deleteContractor(id: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>({
      url: `/admin/v1/contractors/${id}`,
    });
  }

  async getContractImports(
    params: Record<string, string | number | boolean>
  ): Promise<ApiResponse<ContractImportListResponse>> {
    return this.get<ContractImportListResponse>({
      url: "/admin/v1/contract-imports",
      params,
    });
  }

  async createContractImport(
    payload: ContractImportPayload
  ): Promise<ApiResponse<ContractImportResponse>> {
    return this.post<ContractImportResponse>({
      url: "/admin/v1/contract-imports",
      body: payload,
    });
  }

  async getContractImportById(
    id: string
  ): Promise<ApiResponse<ContractImportResponse>> {
    return this.get<ContractImportResponse>({
      url: `/admin/v1/contract-imports/${id}`,
    });
  }

  async getContracts(
    params: Record<string, string | number | boolean>
  ): Promise<ApiResponse<ContractListResponse>> {
    return this.get<ContractListResponse>({
      url: "/admin/v1/contracts",
      params,
    });
  }

  async getContractById(id: string): Promise<ApiResponse<unknown>> {
    return this.get<unknown>({
      url: `/admin/v1/contracts/${id}`,
    });
  }

  // === Методы с использованием фикстур ===

  /**
   * Создание тестового контрактора с использованием фикстур
   */
  async createTestContractor(overrides: Partial<ContractorPayload> = {}): Promise<ApiResponse<ContractorResponse>> {
    const payload = getValidContractorPayload(overrides);
    return this.createContractor(payload);
  }

  /**
   * Создание тестового импорта контракта с использованием фикстур
   */
  async createTestContractImport(
    contractorId: string,
    overrides: Partial<ContractImportPayload> = {}
  ): Promise<ApiResponse<ContractImportResponse>> {
    const payload = getValidContractImportPayload(contractorId, overrides);
    return this.createContractImport(payload);
  }

  /**
   * Создание контрактора с определенным статусом
   */
  async createContractorWithStatus(
    status: string,
    overrides: Partial<ContractorPayload> = {}
  ): Promise<ApiResponse<ContractorResponse>> {
    return this.createTestContractor({ status, ...overrides });
  }

  /**
   * Создание импорта контракта с определенными директориями
   */
  async createContractImportWithDirectories(
    contractorId: string,
    directories: {
      contractDirectory?: string;
      contractAnnexDirectory?: string;
      debtDirectory?: string;
      fileDirectory?: string;
    }
  ): Promise<ApiResponse<ContractImportResponse>> {
    return this.createTestContractImport(contractorId, directories);
  }
}

// === Вспомогательные функции ===

/** Сборщик полезной нагрузки для импорта контракта */
export function buildContractImportPayload(
  contractorId: string,
  overrides?: Partial<ContractImportPayload>
): ContractImportPayload {
  const basePayload: ContractImportPayload = {
    contractorId,
    assignmentNumber: `ASSIGN-${Date.now()}`,
    assigmentDate: new Date().toISOString().split('T')[0],
    contractDirectory: `/contracts/${Date.now()}`,
    contractAnnexDirectory: `/annexes/${Date.now()}`,
    debtDirectory: `/debts/${Date.now()}`,
    fileDirectory: `/files/${Date.now()}`,
  };

  return overrides ? { ...basePayload, ...overrides } : basePayload;
}

/** Сборщик полезной нагрузки для контрактора */
export function buildContractorPayload(params?: Partial<ContractorPayload>): ContractorPayload {
  const basePayload: ContractorPayload = {
    name: '',
    description: '',
    inn: '',
    status: '',
  };

  return params ? { ...basePayload, ...params } : basePayload;
}
