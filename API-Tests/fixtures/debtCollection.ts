/**
 * Фикстуры для Debt Collection (eq-debt-collection)
 * Создание данных для тестирования пакетов документов и контрактов
 */

import { faker } from '@faker-js/faker/locale/ru';
import type { FixtureBuilder, PackageFixture, ContractFixture, BaseResponse, ListResponse, ApiError, ApiResponse } from './types';

// Генерация случайного UUID
const generateUUID = (): string => {
  return faker.string.uuid();
};

// Генерация случайного номера пакета
const generatePackageNumber = (): number => {
  return faker.number.int({ min: 100000, max: 999999 });
};

// Генерация случайного типа пакета
const generatePackageTypeId = (): string => {
  return faker.string.uuid();
};

// Генерация случайного ID ответственного юриста
const generateLawyerId = (): string | null => {
  return faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.8 }) ?? null;
};

// Генерация случайных ID контрактов
const generateContractIds = (count: number = 3): string[] => {
  return Array.from({ length: count }, () => generateUUID());
};

// Генерация случайной даты в формате ISO
const generateCreatedAt = (): string => {
  return faker.date.past({ years: 1 }).toISOString();
};

// Реализация фикстуры пакета долгов
export const getValidDebtPackage = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    id: generateUUID(),
    number: generatePackageNumber(),
    typeId: generatePackageTypeId(),
    statusCode: 'ACTIVE',
    createdAt: generateCreatedAt(),
    responsibleLawyerId: generateLawyerId(),
    includedContracts: generateContractIds(),
    ...overrides,
  };
};

// Реализация фикстуры пакета с определенным статусом
export const getDebtPackageWithStatus = (statusCode: string): Record<string, unknown> => {
  return getValidDebtPackage({ statusCode });
};

// Реализация фикстуры пакета с конкретными контрактами
export const getDebtPackageWithContracts = (contractIds: string[]): Record<string, unknown> => {
  return getValidDebtPackage({ includedContracts: contractIds });
};

// Реализация фикстуры данных долгов (min version)
export const getValidDebtData = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    id: generateUUID(),
    number: generatePackageNumber(),
    typeId: generatePackageTypeId(),
    statusCode: 'ACTIVE',
    createdAt: generateCreatedAt(),
    ...overrides,
  };
};

// Реализация фикстуры контракта
export const getValidContract = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    id: generateUUID(),
    contractorId: generateUUID(),
    assignmentNumber: faker.string.numeric(4),
    assigmentDate: new Date().toISOString(),
    contractDirectory: '/test/contracts/',
    contractAnnexDirectory: '/test/annexes/',
    debtDirectory: '/test/debts/',
    fileDirectory: '/test/files/',
    status: 'ACTIVE',
    ...overrides,
  };
};

// Реализация фикстуры контракта с input fields
export const getValidContractWithInputFields = (inputFields: Record<string, unknown>[]): Record<string, unknown> => {
  return getValidContract({
    contract: {
      fileNamePattern: 'contract_*',
      inputFields,
      isAutoCourt: false,
    },
  });
};

// Реализация контракт фикстуры
export class DebtCollectionContractFixture implements ContractFixture {
  private contract: Record<string, unknown> = {};

  constructor() {
    this.contract = getValidContract();
  }

  required(): Record<string, unknown> {
    return getValidContract();
  }

  withOverrides(overrides: Partial<Record<string, unknown>>): Record<string, unknown> {
    return { ...this.contract, ...overrides };
  }

  withInputFields(fields: Record<string, unknown>[]): Record<string, unknown> {
    return {
      ...this.contract,
      contract: {
        ...(this.contract.contract as Record<string, unknown> | undefined),
        inputFields: fields,
      },
    };
  }

  withCalculateType(type: string): Record<string, unknown> {
    return {
      ...this.contract,
      contract: {
        ...(this.contract.contract as Record<string, unknown> | undefined),
        calculateType: type,
      },
    };
  }

  build(): Record<string, unknown> {
    return this.contract;
  }
}

// Экспорт для совместимости со старым кодом
export const buildTestPackage = getValidDebtPackage;
export const buildTestContract = getValidContract;
export const buildDebtPackage = getValidDebtPackage;