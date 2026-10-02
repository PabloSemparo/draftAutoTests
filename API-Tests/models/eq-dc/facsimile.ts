/**
 * Типы запросов и ответов для Facsimile API (eq-debt-collection)
 */

export interface FacsimileDetailDtoRs {
  id: string;
  lawyerId: string;
  content: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FacsimileCreateDtoRs {
  id: string;
  lawyerId: string;
  content: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export interface FacsimileCreateUpdateDtoRq {
  lawyerId: string;
  content: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface FacsimileListResponse {
  data: FacsimileDetailDtoRs[];
  meta: {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
  };
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