/**
 * Типы запросов и ответов для Package API (eq-debt-collection)
 */

export interface PackageDetailsResponse {
  id: string;
  number: number;
  typeId: string;
  statusCode: string;
  createdAt: string;
  responsibleLawyerId: string | null;
  includedContracts: string[];
  status?: {
    code: string;
    description: string;
  };
}

export interface PackageListResponse {
  data: PackageDetailsResponse[];
  meta: {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
  };
}

export interface PackagePayload {
  number?: number;
  typeId: string;
  statusCode: string;
  responsibleLawyerId?: string | null;
  includedContracts: string[];
}

export interface PackageStatusUpdatePayload {
  statusCode: string;
}

export interface ErrorDtoRs {
  status: {
    code: string;
    description: string;
  };
  errors?: ApiError[];
  details?: Record<string, unknown>;
}

export interface ApiError {
  key: string;
  code: string;
  description: string;
}

// Для update FileInfo
export interface FileInfoPayload {
  fileName: string;
  fileSize: number;
  contentType: string;
}

// Для exclude document
export interface ExcludeDocumentPayload {
  reason?: string;
}

// Для convert to gas
export interface ConvertToGasPayload {
  format?: string;
  options?: Record<string, unknown>;
}

// Для print
export interface PrintPayload {
  printerId?: string;
  copies?: number;
  collate?: boolean;
}

// Для recreate documents
export interface RecreateDocumentsPayload {
  documentIds?: string[];
  allDocuments?: boolean;
}

// Для recreate single document
export interface RecreateSingleDocumentPayload {
  documentId: string;
  reason?: string;
}