/**
 * Фикстуры для Package API (eq-debt-collection)
 * Генерация тестовых данных для тестирования endpoints пакетов документов
 */

import { faker } from '@faker-js/faker/locale/ru';
import type {
  PackageDetailsResponse,
  PackagePayload,
  PackageListResponse,
  PackageStatusUpdatePayload
} from '../../models/openapi/package';

/**
 * Генерация случайного UUID
 */
const generateUUID = (): string => {
  return faker.string.uuid();
};

/**
 * Генерация случайного номера пакета
 */
const generatePackageNumber = (): number => {
  return faker.number.int({ min: 100000, max: 999999 });
};

/**
 * Генерация случайного типа пакета
 */
const generatePackageTypeId = (): string => {
  return faker.string.uuid();
};

/**
 * Генерация случайного ID ответственного юриста
 */
const generateLawyerId = (): string | null => {
  return faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.8 }) ?? null;
};

/**
 * Генерация случайных ID контрактов
 */
const generateContractIds = (count: number = 3): string[] => {
  return Array.from({ length: count }, () => generateUUID());
};

/**
 * Генерация случайной даты в формате ISO
 */
const generateCreatedAt = (): string => {
  return faker.date.past({ years: 1 }).toISOString();
};

/**
 * Создание валидного пакета документов (полный объект)
 */
export const getValidPackage = (overrides: Partial<PackageDetailsResponse> = {}): PackageDetailsResponse => {
  return {
    id: generateUUID(),
    number: generatePackageNumber(),
    typeId: generatePackageTypeId(),
    statusCode: faker.helpers.arrayElement(['ACTIVE', 'DRAFT', 'ARCHIVED', 'CANCELLED']),
    createdAt: generateCreatedAt(),
    responsibleLawyerId: generateLawyerId(),
    includedContracts: generateContractIds(),
    ...overrides,
  };
};

/**
 * Создание пакета для создания (без id и createdAt)
 */
export const getValidPackagePayload = (overrides: Partial<PackagePayload> = {}): PackagePayload => {
  return {
    number: faker.helpers.maybe(() => generatePackageNumber(), { probability: 0.5 }),
    typeId: generatePackageTypeId(),
    statusCode: faker.helpers.arrayElement(['ACTIVE', 'DRAFT']),
    responsibleLawyerId: generateLawyerId(),
    includedContracts: generateContractIds(),
    ...overrides,
  };
};

/**
 * Создание пакета с конкретным статусом
 */
export const getPackageWithStatus = (statusCode: string): PackageDetailsResponse => {
  return getValidPackage({ statusCode });
};

/**
 * Создание пакета с конкретными контрактами
 */
export const getPackageWithContracts = (contractIds: string[]): PackageDetailsResponse => {
  return getValidPackage({ includedContracts: contractIds });
};

/**
 * Создание пакета для обновления статуса
 */
export const getPackageStatusUpdatePayload = (statusCode: string): PackageStatusUpdatePayload => {
  return { statusCode };
};

/**
 * Создание списка пакетов
 */
export const getValidPackageList = (count: number = 5): PackageListResponse => {
  return {
    data: Array.from({ length: count }, () => getValidPackage()),
    meta: {
      totalCount: count,
      pageSize: count,
      pageNumber: 1,
      totalPages: 1,
    },
  };
};

/**
 * Создание пакета с конкретным lawyerId
 */
export const getPackageForLawyer = (lawyerId: string): PackageDetailsResponse => {
  return getValidPackage({ responsibleLawyerId: lawyerId });
};

/**
 * Класс для построения пакета (Builder pattern)
 */
export class PackageFixtureBuilder {
  private packageData: PackageDetailsResponse;

  constructor() {
    this.packageData = getValidPackage();
  }

  withId(id: string): this {
    this.packageData.id = id;
    return this;
  }

  withNumber(number: number): this {
    this.packageData.number = number;
    return this;
  }

  withTypeId(typeId: string): this {
    this.packageData.typeId = typeId;
    return this;
  }

  withStatusCode(statusCode: string): this {
    this.packageData.statusCode = statusCode;
    return this;
  }

  withCreatedAt(createdAt: string): this {
    this.packageData.createdAt = createdAt;
    return this;
  }

  withResponsibleLawyerId(lawyerId: string | null): this {
    this.packageData.responsibleLawyerId = lawyerId;
    return this;
  }

  withIncludedContracts(contractIds: string[]): this {
    this.packageData.includedContracts = contractIds;
    return this;
  }

  build(): PackageDetailsResponse {
    return this.packageData;
  }

  buildPayload(): PackagePayload {
    return {
      number: this.packageData.number,
      typeId: this.packageData.typeId,
      statusCode: this.packageData.statusCode,
      responsibleLawyerId: this.packageData.responsibleLawyerId,
      includedContracts: this.packageData.includedContracts,
    };
  }
}

/**
 * Экспорт для совместимости
 */
export const buildTestPackage = getValidPackage;
export const buildPackageForLawyer = getPackageForLawyer;