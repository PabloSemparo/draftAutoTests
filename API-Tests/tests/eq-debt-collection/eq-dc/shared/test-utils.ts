/**
 * Утилиты для OpenAPI тестов eq-debt-collection
 * Общие методы для всех тестов в директории openapi
 */

import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { BaseTestUtils } from '../../../../test-utils/base-test-utils';

/**
 * Расширение BaseTestUtils для OpenAPI тестов
 */
export class OpenApiTestUtils extends BaseTestUtils {
  /**
   * Установка контекста теста
   */
  static setTestContext(testInfo: any): void {
    this.logStep('Настройка контекста теста', () => {
      this.logParameters({
        'Test Title': testInfo.title,
        'Test File': testInfo.file,
      });
    });
  }

  /**
   * Очистка после теста
   */
  static async cleanupTest(): Promise<void> {
    await this.logStep('Очистка ресурсов', () => {
      console.log('🧹 Очистка ресурсов завершена');
    });
  }

  /**
   * Финализация теста с Allure
   */
  static async finalizeTest(
    isSuccess: boolean,
    description?: string
  ): Promise<void> {
    if (description) {
      await this.logAttachment('Test Result', description, 'text/plain');
    }
    console.log(`${isSuccess ? '✅' : '❌'} Тест завершен: ${description}`);
  }

  /**
   * Валидация структуры ошибки с дополнительной проверкой
   */
  static validateErrorStructureWithDetails(
    error: Record<string, unknown>,
    expectedKey?: string,
    expectedCode?: string,
    expectedDescription?: string
  ): void {
    this.validateErrorStructure(error, expectedKey, expectedCode);

    if (expectedDescription) {
      expect(error.description, `Описание ошибки должно быть "${expectedDescription}"`).toBe(expectedDescription);
    }

    if (error.details !== undefined) {
      this.logAttachment('Error Details', error.details as object, 'application/json');
    }
  }

  /**
   * Валидация списка ответов
   */
  static validateListResponseStructure(
    response: Record<string, unknown>,
    dataKey: string = 'data'
  ): void {
    expect(response, 'Ответ должен содержать data').toHaveProperty(dataKey);
    expect(response, 'Ответ должен содержать meta').toHaveProperty('meta');

    const data = response[dataKey];
    expect(Array.isArray(data), `${dataKey} должен быть массивом`).toBe(true);

    const meta = response.meta as Record<string, unknown>;
    expect(meta, 'Meta должен содержать totalCount').toHaveProperty('totalCount');
    expect(meta, 'Meta должен содержать pageSize').toHaveProperty('pageSize');
    expect(meta, 'Meta должен содержать pageNumber').toHaveProperty('pageNumber');
    expect(meta, 'Meta должен содержать totalPages').toHaveProperty('totalPages');
  }

  /**
   * Валидация пагинации
   */
  static validatePagination(
    meta: Record<string, unknown>,
    expectedPageSize?: number,
    expectedTotalCount?: number
  ): void {
    if (expectedPageSize) {
      expect(meta.pageSize, `PageSize должен быть ${expectedPageSize}`).toBe(expectedPageSize);
    }

    if (expectedTotalCount) {
      expect(meta.totalCount, `TotalCount должен быть ${expectedTotalCount}`).toBe(expectedTotalCount);
    }

    // Валидация логики пагинации
    const pageNumber = meta.pageNumber as number;
    const totalPages = meta.totalPages as number;
    const totalCount = meta.totalCount as number;
    const pageSize = meta.pageSize as number;

    if (totalCount > 0 && pageSize > 0) {
      const calculatedTotalPages = Math.ceil(totalCount / pageSize);
      expect(totalPages, `TotalPages должен быть ${calculatedTotalPages}`).toBe(calculatedTotalPages);
    }

    expect(pageNumber, 'PageIndex должен быть >= 1').toBeGreaterThanOrEqual(1);
    expect(totalPages, 'TotalPages должен быть >= 1').toBeGreaterThanOrEqual(1);
    expect(pageNumber, `PageIndex должен быть <= TotalPages (${totalPages})`).toBeLessThanOrEqual(totalPages);
  }

  /**
   * Валидация пакета с деталями
   */
  static validatePackageWithDetails(
    packageData: Record<string, unknown>,
    expectedContractsCount?: number
  ): void {
    this.validatePackageResponseStructure(packageData);

    // Валидация контрактов
    if (expectedContractsCount !== undefined) {
      expect(packageData.includedContracts, `Количество контрактов должно быть ${expectedContractsCount}`).toHaveLength(expectedContractsCount);
    }

    // Валидация статуса
    if (packageData.status !== undefined) {
      const status = packageData.status as Record<string, unknown>;
      expect(status, 'Status должен содержать code').toHaveProperty('code');
      expect(status, 'Status должен содержать description').toHaveProperty('description');
    }
  }
}

/**
 * Экспорт для совместимости
 */
export const TestUtils = OpenApiTestUtils;