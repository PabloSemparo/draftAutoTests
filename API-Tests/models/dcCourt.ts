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
