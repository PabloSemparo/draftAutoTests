import { APIResponse } from '@playwright/test';

export interface PackageResponse {
    id: string;
    number: number;
    typeId: string;
    statusCode: string;
    createdAt: string;
    responsibleLawyerId: string | null;
    includedContracts: string[];
}

export class PackageAssertions {
    static async validatePackageResponse(
        response: APIResponse,
        options: { maxResponseTime?: number } = {}
    ) {
        const maxResponseTime = options.maxResponseTime || 200;
        const startTime = Date.now();
        const responseTime = Date.now() - startTime;

        // Basic response checks
        expect(response.status()).toBe(200);
        expect(responseTime).toBeLessThan(maxResponseTime);
        expect(response.headers()['content-type']).toContain('application/json');

        const responseData: PackageResponse = await response.json();

        // Validate all required fields exist
        this.validateRequiredFields(responseData);

        // Validate data types
        this.validateDataTypes(responseData);

        // Validate specific field constraints
        this.validateFieldConstraints(responseData);

        return { responseData, responseTime };
    }

    private static validateRequiredFields(responseData: any) {
        const expectedKeys = ['id', 'number', 'typeId', 'statusCode', 'createdAt', 'responsibleLawyerId', 'includedContracts'];

        expectedKeys.forEach(key => {
            expect(responseData, `Missing required field: ${key}`).toHaveProperty(key);
        });
    }

    private static validateDataTypes(responseData: PackageResponse) {
        expect(typeof responseData.id).toBe('string');
        expect(typeof responseData.number).toBe('number');
        expect(typeof responseData.typeId).toBe('string');
        expect(typeof responseData.statusCode).toBe('string');
        expect(typeof responseData.createdAt).toBe('string');

        // responsibleLawyerId can be string or null
        if (responseData.responsibleLawyerId !== null) {
            expect(typeof responseData.responsibleLawyerId).toBe('string');
        }

        expect(Array.isArray(responseData.includedContracts)).toBe(true);

        // Validate includedContracts items
        responseData.includedContracts.forEach((contract, index) => {
            expect(typeof contract, `Invalid contract type at index ${index}`).toBe('string');
        });
    }

    private static validateFieldConstraints(responseData: PackageResponse) {
        // Validate createdAt is a valid date
        const createdAtDate = new Date(responseData.createdAt);
        expect(isNaN(createdAtDate.getTime()), 'createdAt should be a valid ISO date string').toBe(false);

        // Validate includedContracts is not null
        expect(responseData.includedContracts).not.toBeNull();

        // Validate responsibleLawyerId constraints
        if (typeof responseData.responsibleLawyerId === 'string') {
            expect(responseData.responsibleLawyerId.length).toBeGreaterThan(0);
        }
    }
}