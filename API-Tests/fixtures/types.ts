/**
 * Типы для фикстур тестовых данных
 */

// Фикстура для построения объектов с возможностью переопределения
export interface FixtureBuilder<T> {
  required(): T;
  withOverrides(overrides: Partial<T>): T;
}

// Фикстура для контракторов
export interface ContractorFixture extends FixtureBuilder<ContractorPayload> {
  withStatus(status: string): ContractorPayload;
  withCustomContract(contract: Record<string, unknown>): ContractorPayload;
}

// Фикстура для пакетов долгов
export interface PackageFixture extends FixtureBuilder<unknown> {
  withStatus(statusCode: string): unknown;
  withContracts(contractIds: string[]): unknown;
}

// Фикстура для контрактов
export interface ContractFixture extends FixtureBuilder<Record<string, unknown>> {
  withInputFields(fields: Record<string, unknown>[]): Record<string, unknown>;
  withCalculateType(type: string): Record<string, unknown>;
}

// Фикстура для поиска судов
export interface CourtSearchFixture extends FixtureBuilder<unknown> {
  withInn(inn: string): unknown;
  withFio(fio: string): unknown;
  withBirthDate(date: string): unknown;
}

// Используем типы из других файлов для удобства
export type { BaseResponse } from '../models/common';
export type { ListResponse } from '../models/common';
export type { ApiError } from '../models/eq-dc/facsimile';

// Определение типов из debtImporter (для избежания проблем с относительными импортами)
export interface ContractorPayload {
  name: string;
  description?: string;
  inn: string;
  status: string;
  contract?: Record<string, unknown>;
  contractAnnex?: Record<string, unknown>;
  contractDebt?: Record<string, unknown>;
  debt?: Record<string, unknown>;
}

export interface ContractorResponse extends ContractorPayload {
  id: string;
}

// Типы для договоров (Contracts)
// Используем CreateContractRequest и CreateContractResponse из test-utils/contract-utils.ts