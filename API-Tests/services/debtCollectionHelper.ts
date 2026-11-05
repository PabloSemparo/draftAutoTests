/**
 * Слой сервисов для eq-debt-collection
 * Использует централизованные фикстуры из ../fixtures
 */

import { getValidDebtPackage } from '../fixtures/debtCollection';
// DebtCollectionServiceOptions - не существует, используем DebtCollectionService

/**
 * Создание тестового пакета долгов с использованием фикстур
 */
export function createTestPackage(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return getValidDebtPackage(overrides);
}

/**
 * Создание тестового пакета с определенным статусом
 */
export function createPackageWithStatus(statusCode: string): Record<string, unknown> {
  const pkg = getValidDebtPackage();
  pkg.statusCode = statusCode;
  return pkg;
}

/**
 * Создание тестового пакета с конкретными контрактами
 */
export function createPackageWithContracts(contractIds: string[]): Record<string, unknown> {
  return getValidDebtPackage({ includedContracts: contractIds });
}

/**
 * Вспомогательная функция для создания пакета в тестах
 */
export const createDebtPackage = createTestPackage;