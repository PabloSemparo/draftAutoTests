import { allure } from 'allure-playwright';
import { APIResponse } from '@playwright/test';

export class AllureHelpers {
    static async attachApiResponse(response: APIResponse, name: string = 'API Response') {
        const status = response.status();
        const headers = response.headers();
        const body = await response.text();

        allure.attachment(
            `${name} - Status`,
            `Status: ${status}\nURL: ${response.url()}`,
            'text/plain'
        );

        allure.attachment(
            `${name} - Headers`,
            JSON.stringify(headers, null, 2),
            'application/json'
        );

        try {
            const jsonBody = JSON.parse(body);
            allure.attachment(
                `${name} - Body`,
                JSON.stringify(jsonBody, null, 2),
                'application/json'
            );
        } catch {
            allure.attachment(`${name} - Body`, body, 'text/plain');
        }
    }

    static attachEnvironmentInfo() {
        const envInfo = {
            timestamp: new Date().toISOString(),
            node_version: process.version,
            platform: process.platform,
            base_url: process.env.BASE_URL,
            test_env: process.env.TEST_ENV || 'stage'
        };

        allure.attachment('Environment Info', JSON.stringify(envInfo, null, 2), 'application/json');
    }

    static startTest(name: string, description?: string) {
        allure.displayName(name);
        if (description) {
            allure.description(description);
        }
    }
}