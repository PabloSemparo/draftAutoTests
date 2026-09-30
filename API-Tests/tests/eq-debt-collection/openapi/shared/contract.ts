/**
 * Фикстуры для контрактов (используются в пакетах документов)
 */

import { faker } from '@faker-js/faker/locale/ru';
import type { ContractFixture } from '../types';

const generateUUID = (): string => {
  return faker.string.uuid();
};

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
    contract: {
      fileNamePattern: 'contract_*',
      inputFields: [],
      isAutoCourt: false,
    },
    ...overrides,
  };
};

export class DebtCollectionContractFixture implements ContractFixture {
  private contract: Record<string, unknown> = {};

  constructor() {
    this.contract = getValidContract();
  }

  required(): Record<string, unknown> {
    return getValidContract();
  }

  withOverrides(overrides: Record<string, unknown>): DebtCollectionContractFixture {
    this.contract = { ...this.contract, ...overrides };
    return this;
  }

  withInputFields(fields: Record<string, unknown>[]): DebtCollectionContractFixture {
    this.contract = {
      ...this.contract,
      contract: {
        ...this.contract.contract,
        inputFields: fields,
      },
    };
    return this;
  }

  withCalculateType(type: string): DebtCollectionContractFixture {
    this.contract = {
      ...this.contract,
      contract: {
        ...this.contract.contract,
        calculateType: type,
      },
    };
    return this;
  }

  build(): Record<string, unknown> {
    return this.contract;
  }
}

// Экспорт для совместимости
export const buildTestContract = getValidContract;