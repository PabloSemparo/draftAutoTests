/**
 * Фикстуры для Debt Importer (eq-dc-debt-importer)
 * Создание данных для тестирования сервиса управления контракторами и импортом контрактов
 */

import { faker } from '@faker-js/faker/locale/ru';
import type { FixtureBuilder, ContractorFixture, ContractFixture } from './types';
import type {
  ContractorPayload,
  ContractorResponse,
  ContractImportPayload,
  ContractImportResponse,
} from '../models/debtImporter';

// Реализация фикстуры контрактора
export const getValidContractorPayload = (overrides: Partial<ContractorPayload> = {}): ContractorPayload => {
  return {
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    inn: faker.string.numeric(10),
    status: 'ACTIVE',
    contract: {
      fileNamePattern: 'contract_*',
      inputFields: [],
      isAutoCourt: false,
    },
    contractAnnex: {
      fileNamePattern: 'annex_*',
      inputFields: [],
    },
    debt: {
      fileLocationType: 'COMMON',
      inputFields: [],
    },
    ...overrides,
  };
};

// Реализация фикстуры контракт импорта
export const getValidContractImportPayload = (
  contractorId: string,
  overrides: Partial<ContractImportPayload> = {}
): ContractImportPayload => {
  return {
    contractorId,
    assignmentNumber: faker.string.numeric(4),
    assigmentDate: new Date().toISOString(),
    contractDirectory: '/test/contracts/',
    contractAnnexDirectory: '/test/annexes/',
    debtDirectory: '/test/debts/',
    fileDirectory: '/test/files/',
    ...overrides,
  };
};

// Реализация фикстуры контрактора с расширенными методами
export const getContractorWithStatus = (status: string): ContractorPayload => {
  return getValidContractorPayload({ status });
};

export const getContractorWithCustomContract = (
  contract: Record<string, unknown>,
  contractAnnex?: Record<string, unknown>,
  debt?: Record<string, unknown>
): ContractorPayload => {
  return getValidContractorPayload({
    contract: {
      fileNamePattern: 'contract_*',
      inputFields: [],
      isAutoCourt: false,
      ...contract,
    },
    contractAnnex: {
      fileNamePattern: 'annex_*',
      inputFields: [],
      ...contractAnnex,
    },
    debt: {
      fileLocationType: 'COMMON',
      inputFields: [],
      ...debt,
    },
  });
};

// Реализация контракт фикстуры
export const getValidContract = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    fileNamePattern: 'contract_*',
    inputFields: [
      {
        outputFieldId: faker.string.uuid(),
        inputColumnHeaders: ['Номер договора', 'Номер договора 2'],
      },
    ],
    isAutoCourt: false,
    ...overrides,
  };
};

// Экспорт для совместимости со старым кодом
export const buildContractorPayload = getValidContractorPayload;
export const buildContractImportPayload = getValidContractImportPayload;