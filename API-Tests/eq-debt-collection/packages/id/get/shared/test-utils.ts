// tests/shared/test-utils.ts
import { test, expect } from '@playwright/test';
import { allure } from "allure-playwright";
import { ApiResponse, ApiError, PackageResponse } from './types';

export class TestUtils {
    private static testContext: any;

    // Инициализация контекста теста
    static setTestContext(context: any) {
        this.testContext = context;
    }

    static async setupAllure(
        epic: string,
        feature: string,
        story: string,
        severity: string = "normal",
        tags: string[] = []
    ) {
        await allure.epic(epic);
        await allure.feature(feature);
        await allure.story(story);
        await allure.severity(severity);

        for (const tag of tags) {
            await allure.tag(tag);
        }
    }

    static async setupParentSuite(suite: string, subSuite: string) {
        await allure.parentSuite("API Tests");
        await allure.suite(suite);
        await allure.subSuite(subSuite);
    }

    static async logStep(stepName: string, action: () => Promise<void>) {
        await allure.step(stepName, action);
    }

    static async logParameters(parameters: Record<string, string>) {
        for (const [key, value] of Object.entries(parameters)) {
            await allure.parameter(key, value);
        }
    }

    static async logAttachment(name: string, content: string | object, type: string = "application/json") {
        const contentString = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
        await allure.attachment(name, contentString, type);
    }

    static async validateResponseTime(startTime: number, maxTime: number) {
        const responseTime = Date.now() - startTime;
        expect(responseTime, `Время ответа должно быть меньше ${maxTime}ms`).toBeLessThan(maxTime);
        await this.logAttachment("Response Time", `Response time: ${responseTime}ms`, "text/plain");
        return responseTime;
    }

    static validateApiResponseStructure(responseBody: ApiResponse) {
        expect(responseBody, 'Ответ должен содержать статус, ошибки и детали').toHaveProperty('status');
        expect(responseBody).toHaveProperty('errors');
        expect(responseBody).toHaveProperty('details');

        expect(responseBody.status, 'Status должен содержать code и description').toHaveProperty('code');
        expect(responseBody.status).toHaveProperty('description');

        if (responseBody.errors) {
            expect(Array.isArray(responseBody.errors), 'Errors должен быть массивом').toBe(true);
        }
    }

    static validateStatusCode(actualCode: number, expectedCode: number) {
        expect(actualCode, `Статус код должен быть ${expectedCode}`).toBe(expectedCode);
    }

    static validateErrorStructure(error: ApiError, expectedKey?: string, expectedCode?: string) {
        expect(error, 'Ошибка должна содержать key, code и description').toHaveProperty('key');
        expect(error).toHaveProperty('code');
        expect(error).toHaveProperty('description');

        if (expectedKey) {
            expect(error.key, `Ключ ошибки должен быть "${expectedKey}"`).toBe(expectedKey);
        }
        if (expectedCode) {
            expect(error.code, `Код ошибки должен быть "${expectedCode}"`).toBe(expectedCode);
        }
    }

    static async validateExpectedStatusCodes(actualCode: number, expectedCodes: number[]) {
        expect(actualCode, 'Статус код должен быть определен').toBeDefined();
        expect(typeof actualCode, 'Статус код должен быть числом').toBe('number');
        expect(expectedCodes, `Статус код должен быть одним из: ${expectedCodes.join(', ')}`).toContain(actualCode);

        await this.logParameters({ "Actual Status Code": actualCode.toString() });
        return actualCode;
    }

    static validatePackageResponseStructure(responseBody: PackageResponse) {
        expect(responseBody, 'Ответ должен содержать все обязательные поля').toHaveProperty('id');
        expect(responseBody).toHaveProperty('number');
        expect(responseBody).toHaveProperty('typeId');
        expect(responseBody).toHaveProperty('statusCode');
        expect(responseBody).toHaveProperty('createdAt');
        expect(responseBody).toHaveProperty('responsibleLawyerId');
        expect(responseBody).toHaveProperty('includedContracts');

        // Проверка типов данных с использованием правильных методов Playwright
        expect(typeof responseBody.id, 'ID должен быть строкой').toBe('string');
        expect(typeof responseBody.number, 'Number должен быть числом').toBe('number');
        expect(typeof responseBody.typeId, 'TypeId должен быть строкой').toBe('string');
        expect(typeof responseBody.statusCode, 'StatusCode должен быть строкой').toBe('string');
        expect(typeof responseBody.createdAt, 'CreatedAt должен быть строкой').toBe('string');
        expect(typeof responseBody.responsibleLawyerId, 'ResponsibleLawyerId должен быть строкой').toBe('string');
        expect(Array.isArray(responseBody.includedContracts), 'IncludedContracts должен быть массивом').toBe(true);
    }

    static validateContentType(headers: any) {
        const contentType = headers['content-type'];
        expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
    }

    static validateDateField(dateString: string) {
        const date = new Date(dateString);
        expect(isNaN(date.getTime()), 'Дата должна быть валидной').toBe(false);
    }

    static validateResponsibleLawyerId(lawyerId: string) {
        const isValid = typeof lawyerId === 'string' ? lawyerId.length > 0 : lawyerId === null;
        expect(isValid, 'ResponsibleLawyerId должен быть непустой строкой или null').toBe(true);
    }

    static validateStringField(value: any, fieldName: string) {
        expect(typeof value, `${fieldName} должен быть строкой`).toBe('string');
    }

    static validateNumberField(value: any, fieldName: string) {
        expect(typeof value, `${fieldName} должен быть числом`).toBe('number');
    }

    static validateArrayField(value: any, fieldName: string) {
        expect(Array.isArray(value), `${fieldName} должен быть массивом`).toBe(true);
    }

    // Методы для завершения тестов
    static async finalizeTest(success: boolean = true, message?: string) {
        await this.logStep("Завершение теста", async () => {
            const status = success ? "ПРОЙДЕН" : "ПРОВАЛЕН";
            await this.logAttachment("Test Status", `Тест ${status}${message ? `: ${message}` : ''}`, "text/plain");

            if (success) {
                console.log(`✅ Тест успешно завершен${message ? `: ${message}` : ''}`);
            } else {
                console.log(`❌ Тест завершен с ошибкой${message ? `: ${message}` : ''}`);
            }
        });
    }

    static async cleanupTest() {
        await this.logStep("Очистка после теста", async () => {
            // Здесь можно добавить логику очистки
            // Например: закрытие соединений, удаление временных данных и т.д.
            await this.logAttachment("Cleanup", "Ресурсы освобождены", "text/plain");
        });
    }
}