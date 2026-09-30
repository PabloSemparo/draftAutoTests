// Типы запросов и ответов для eq-debt-collection

export interface PackageDetailsResponse {
  id: string;
  number: number;
  typeId: string;
  statusCode: string;
  createdAt: string;
  responsibleLawyerId: string | null;
  includedContracts: string[];
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

export interface PackageResponse extends PackageDetailsResponse {
  status?: {
    code: string;
    description: string;
  };
}

export interface PackageStatusUpdatePayload {
  statusCode: string;
}
