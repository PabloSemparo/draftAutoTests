export interface ListResponse<T> {
  items: T[];
  total?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface BaseResponse {
  status?: {
    code?: string;
    description?: string;
  };
}

export interface ApiErrorItem {
  code?: string;
  description?: string;
  key?: string;
}

export interface ApiErrorResponse {
  status?: {
    code?: string;
    description?: string;
  };
  errors?: ApiErrorItem[];
}
