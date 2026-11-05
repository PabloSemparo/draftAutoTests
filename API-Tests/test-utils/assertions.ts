/**
 * Доменно-специфичные ассерты для API тестов
 */

import { expect } from '@playwright/test';
import { BaseTestUtils } from './base-test-utils';

/**
 * Валидация ответа пакета документов
 */
export class PackageAssertions {
  /**
   * Валидация базовой структуры ответа пакета
   */
  static validatePackageResponseStructure(responseBody: Record<string, unknown>): void {
    BaseTestUtils.validatePackageResponseStructure(responseBody);
  }

  /**
   * Валидация структуры ошибки пакета
   */
  static validatePackageErrorStructure(
    error: Record<string, unknown>,
    expectedKey?: string,
    expectedCode?: string
  ): void {
    BaseTestUtils.validateErrorStructure(error, expectedKey, expectedCode);
  }

  /**
   * Валидация структуры пакета с деталями
   */
  static async validatePackageWithDetails(
    responseBody: Record<string, unknown>,
    expectedFields: string[]
  ): Promise<void> {
    expectedFields.forEach(field => {
      expect(responseBody, `Response should have field: ${field}`).toHaveProperty(field);
    });
  }

  /**
   * Валидация пустого списка пакетов
   */
  static validateEmptyPackageList(list: unknown[]): void {
    expect(Array.isArray(list), 'List should be an array').toBe(true);
    expect(list.length, 'List should be empty').toBe(0);
  }

  /**
   * Валидация списка пакетов с элементами
   */
  static validateNonEmptyPackageList(list: unknown[]): void {
    expect(Array.isArray(list), 'List should be an array').toBe(true);
    expect(list.length, 'List should have items').toBeGreaterThan(0);
  }
}

/**
 * Валидация ответов от DC Court сервиса
 */
export class CourtAssertions {
  /**
   * Валидация ответа проверки банкротства
   */
  static validateBankruptCheckResponse(
    response: Record<string, unknown>,
    expectedStatus: 'FOUND' | 'NOT_FOUND' = 'FOUND'
  ): void {
    expect(response).toHaveProperty('status');
    
    const status = response.status as Record<string, unknown>;
    if (expectedStatus === 'FOUND') {
      expect(status.code, 'Status code should be FOUND').toBe('FOUND');
    } else {
      expect(status.code, 'Status code should be NOT_FOUND').toBe('NOT_FOUND');
    }
  }

  /**
   * Валидация ответа поиска судов
   */
  static validateCourtSearchResponse(
    response: Record<string, unknown>,
    expectedCount: number = 0
  ): void {
    expect(response).toHaveProperty('data');
    expect(response.data, 'Data should be an array').toBeInstanceOf(Array);
    expect((response.data as unknown[]).length, 'Data length should match').toBeGreaterThanOrEqual(expectedCount);
  }
}

/**
 * Валидация ответов от Debt Importer сервиса
 */
export class DebtImporterAssertions {
  /**
   * Валидация ответа создания контрактора
   */
  static validateContractorCreationResponse(
    response: Record<string, unknown>,
    expectedStatus: number = 201
  ): void {
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('status');
    expect(response.status, 'Status should be ACTIVE').toBe('ACTIVE');
  }

  /**
   * Валидация ответа импорта контракта
   */
  static validateContractImportResponse(
    response: Record<string, unknown>,
    expectedStatus: number = 201
  ): void {
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('status');
  }

  /**
   * Валидация ошибки создания контрактора
   */
  static validateContractorCreationError(
    error: Record<string, unknown>,
    expectedCode: string
  ): void {
    expect(error.code, `Error code should be ${expectedCode}`).toBe(expectedCode);
    expect(error.description, 'Error should have description').toBeDefined();
  }
}

// Экспорт утилит для совместимости
export { BaseTestUtils, CustomMatchers } from './base-test-utils';