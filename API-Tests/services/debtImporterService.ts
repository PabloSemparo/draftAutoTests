import type { APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker/locale/ru";

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
}

export function buildContractorPayload(
  overrides: Partial<ContractorPayload> = {}
): ContractorPayload {
  return {
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    inn: faker.string.numeric(10),
    status: "ACTIVE",
    contract: {
      fileNamePattern: "contract_pattern",
      inputFields: [],
      isAutoCourt: false,
    },
    contractAnnex: {
      fileNamePattern: "annex_pattern",
      inputFields: [],
    },
    debt: {
      fileLocationType: "COMMON",
      inputFields: [],
    },
    ...overrides,
  };
}

export function buildContractImportPayload(
  contractorId: string,
  overrides: Partial<ContractImportPayload> = {}
): ContractImportPayload {
  return {
    contractorId,
    assignmentNumber: faker.string.numeric(4),
    assigmentDate: new Date().toISOString(),
    contractDirectory: "/test/contracts/",
    contractAnnexDirectory: "/test/annexes/",
    debtDirectory: "/test/debts/",
    fileDirectory: "/test/files/",
    ...overrides,
  };
}
