/**
 * Фикстуры для DC Court (eq-dc-court)
 * Создание данных для тестирования сервиса проверки банкротства и поиска судов
 */

import { faker } from '@faker-js/faker/locale/ru';
import type { FixtureBuilder, CourtSearchFixture } from './types';

// Генерация случайного ИНН
const generateInn = (): string => {
  return faker.string.numeric(10);
};

// Генерация случайного ФИО
const generateFio = (): string => {
  return `${faker.person.lastName()} ${faker.person.firstName()} ${faker.person.prefix()}`;
};

// Генерация случайной даты рождения
const generateBirthDate = (): string => {
  return faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0];
};

// Генерация случайного ID суда
const generateCourtId = (): string => {
  return faker.string.uuid();
};

// Генерация случайного адреса суда
const generateCourtAddress = (): string => {
  return faker.location.streetAddress();
};

// Генерация случайной суммы долга
const generateDutyAmount = (): number => {
  return faker.number.int({ min: 1000, max: 1000000 });
};

// Реализация фикстуры поиска судов
export const getValidCourtSearchItem = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    id: generateCourtId(),
    name: `${faker.company.name()} (${faker.company.catchPhrase()})`,
    address: generateCourtAddress(),
    dutyAmount: faker.helpers.maybe(() => generateDutyAmount(), { probability: 0.7 }),
    ...overrides,
  };
};

// Реализация фикстуры поиска судов с долgow
export const getValidCourtSearchItemWithDuty = (dutyAmount: number): Record<string, unknown> => {
  return getValidCourtSearchItem({ dutyAmount });
};

// Реализация фикстуры поиска по ИНН
export const getValidBankruptCheckParams = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    inn: generateInn(),
    fio: faker.helpers.maybe(() => generateFio(), { probability: 0.5 }),
    birthDate: faker.helpers.maybe(() => generateBirthDate(), { probability: 0.5 }),
    ...overrides,
  };
};

// Реализация фикстуры поиска по ФИО
export const getValidBankruptCheckByFio = (fio: string): Record<string, unknown> => {
  return getValidBankruptCheckParams({ fio });
};

// Реализация фикстуры поиска по ИНН и ФИО
export const getValidBankruptCheckByInnAndFio = (inn: string, fio: string): Record<string, unknown> => {
  return getValidBankruptCheckParams({ inn, fio });
};

// Реализация фикстуры данных суда
export const getValidCourtData = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    courtId: generateCourtId(),
    courtName: faker.company.name(),
    caseNumber: `${faker.number.int({ min: 100000, max: 999999 })}/${faker.date.past().getFullYear()}`,
    caseStage: 'first',
    defendant: generateFio(),
    plaintiff: faker.company.name(),
    claimAmount: generateDutyAmount(),
    ...overrides,
  };
};

// Реализация фикстуры банкротства
export const getValidBankruptcy = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    status: 'BANKRUPT',
    caseNumber: faker.string.alphanumeric(10),
    bankruptcyDate: faker.date.past().toISOString(),
    court: getValidCourtData(),
    ...overrides,
  };
};

// Реализация фикстуры ответа проверки банкротства
export const getValidBankruptCheckResponse = (overrides: Record<string, unknown> = {}): Record<string, unknown> => {
  return {
    status: faker.helpers.maybe(
      () => ({ code: 'FOUND', description: 'Банкрот найден' }),
      { probability: 0.5 }
    ) ?? { code: 'NOT_FOUND', description: 'Банкрот не найден' },
    ...overrides,
  };
};

// Реализация курт поиска фикстуры
export class DcCourtSearchFixture implements CourtSearchFixture {
  private params: Record<string, unknown> = {};

  constructor() {
    this.params = getValidBankruptCheckParams();
  }

  required(): Record<string, unknown> {
    return getValidBankruptCheckParams();
  }

  withOverrides(overrides: Record<string, unknown>): CourtSearchFixture {
    this.params = { ...this.params, ...overrides };
    return this;
  }

  withInn(inn: string): CourtSearchFixture {
    this.params = { ...this.params, inn };
    return this;
  }

  withFio(fio: string): CourtSearchFixture {
    this.params = { ...this.params, fio };
    return this;
  }

  withBirthDate(date: string): CourtSearchFixture {
    this.params = { ...this.params, birthDate: date };
    return this;
  }

  build(): Record<string, unknown> {
    return this.params;
  }
}

// Экспорт для совместимости со старым кодом
export const buildCourtSearchParams = getValidBankruptCheckParams;
export const buildBankruptCheck = getValidBankruptcy;