// test-utils.ts
import { APIRequestContext } from '@playwright/test';
import { ApiResponse, PrintRequest } from './types';

export class PackagePrintAPI {
    constructor(private request: APIRequestContext, private baseUrl: string) {}

    async sendPrintRequest(
        packageId: string,
        requestBody: PrintRequest,
        expectedStatus: number = 200
    ): Promise<{ response: any; body: ApiResponse | string }> {

        const response = await this.request.post(`${this.baseUrl}/v1/packages/${packageId}/print`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: requestBody
        });

        let responseBody: ApiResponse | string;

        if (response.headers()['content-type']?.includes('application/json')) {
            responseBody = await response.json();
        } else {
            responseBody = await response.text();
        }

        return { response, body: responseBody };
    }

    validateErrorResponse(body: ApiResponse, expectedErrorCount: number = 1) {
        expect(body.status).toBeDefined();
        expect(body.status.code).toBeDefined();
        expect(body.status.description).toBeDefined();

        if (expectedErrorCount > 0) {
            expect(body.errors).toHaveLength(expectedErrorCount);
            body.errors!.forEach(error => {
                expect(error.key).toBeDefined();
                expect(error.code).toBeDefined();
                expect(error.description).toBeDefined();
            });
        }
    }
}