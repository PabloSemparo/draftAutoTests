import type { ListResponse } from "@models/common";

export interface ContractorPayload {
  name: string;
  description?: string;
  inn: string;
  status: string;
  contract?: Record<string, unknown>;
  contractAnnex?: Record<string, unknown>;
  contractDebt?: Record<string, unknown>;
  debt?: Record<string, unknown>;
}

export interface ContractorResponse extends ContractorPayload {
  id: string;
}

export interface ContractImportPayload {
  contractorId: string;
  assignmentNumber: string;
  assigmentDate: string;
  contractDirectory: string;
  contractAnnexDirectory: string;
  debtDirectory: string;
  fileDirectory: string;
}

export interface ContractImportResponse extends ContractImportPayload {
  id: string;
  status?: string;
}

export interface ContractResponse {
  id: string;
  status?: string;
}

export type ContractorListResponse = ListResponse<ContractorResponse>;
export type ContractImportListResponse = ListResponse<ContractImportResponse>;
export type ContractListResponse = ListResponse<ContractResponse>;
