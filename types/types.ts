// types.ts
export interface ApiResponse {
    status: {
        code: string;
        description: string;
    };
    errors?: ApiError[];
    details?: any;
}

export interface ApiError {
    key: string;
    code: string;
    description: string;
}

export interface PrintRequest {
    courtLawyerId: string;
    documentIds: string[];
}

export interface TestConfig {
    baseUrl: string;
    timeout: number;
}