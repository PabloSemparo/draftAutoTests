// Типы запросов и ответов для eq-dc-court

export interface BankruptCheckParams {
  inn?: string;
  fio?: string;
  birthDate?: string;
}

export interface BankruptCheckResponse {
  status: string | {
    code?: string;
    description?: string;
  };
}

export interface CourtSearchItem {
  id: string;
  name: string;
  address: string;
  dutyAmount?: number;
}

export interface CourtSearchResponse {
  data: CourtSearchItem[];
  meta?: {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
  };
}

export interface CourtDetails {
  courtId: string;
  courtName: string;
  caseNumber: string;
  caseStage: string;
  defendant: string;
  plaintiff: string;
  claimAmount: number;
}

export interface BankruptcyDetails {
  status: 'BANKRUPT' | 'NOT_BANKRUPT';
  caseNumber: string;
  bankruptcyDate: string;
  court: CourtDetails;
}
