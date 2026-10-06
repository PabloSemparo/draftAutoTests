/**
 * Фикстуры для Facsimile API (eq-debt-collection)
 * Генерация тестовых данных для тестирования endpoints факсимиле
 */

import { faker } from '@faker-js/faker/locale/ru';
import type { 
  FacsimileDetailDtoRs, 
  FacsimileCreateUpdateDtoRq, 
  FacsimileListResponse,
  ErrorDtoRs,
  ApiError 
} from '../../models/eq-dc/facsimile';

// Экспорт типов для использования в fixtures/types.ts
export type { FacsimileDetailDtoRs, FacsimileCreateUpdateDtoRq, FacsimileListResponse, ErrorDtoRs, ApiError };

/**
 * Генерация случайного UUID
 */
const generateUUID = (): string => {
  return faker.string.uuid();
};

/**
 * Генерация случайного имени файла
 */
const generateFileName = (): string => {
  return `facsimile_${faker.string.uuid()}.${faker.helpers.arrayElement(['png', 'jpg', 'pdf'])}`;
};

/**
 * Генерация случайного content type
 */
const generateContentType = (): string => {
  return faker.helpers.arrayElement(['image/png', 'image/jpeg', 'application/pdf']);
};

/**
 * Генерация фейкового base64 контента
 */
const generateBase64Content = (size: number = 1024): string => {
  const array = new Uint8Array(size);
  faker.number.int({ min: 0, max: 255 });
  for (let i = 0; i < size; i++) {
    array[i] = faker.number.int({ min: 0, max: 255 });
  }
  return btoa(String.fromCharCode(...array));
};

/**
 * Создание валидного факсимиле (полный объект)
 */
export const getValidFacsimileDetail = (overrides: Partial<FacsimileDetailDtoRs> = {}): FacsimileDetailDtoRs => {
  return {
    id: generateUUID(),
    lawyerId: generateUUID(),
    content: generateBase64Content(),
    fileName: generateFileName(),
    contentType: generateContentType(),
    fileSize: faker.number.int({ min: 1024, max: 1048576 }),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.helpers.maybe(() => faker.date.recent().toISOString(), { probability: 0.8 }),
    ...overrides,
  };
};

/**
 * Создание факсимиле для создания (без id и createdAt)
 */
export const getValidFacsimileCreateUpdate = (overrides: Partial<FacsimileCreateUpdateDtoRq> = {}): FacsimileCreateUpdateDtoRq => {
  return {
    lawyerId: generateUUID(),
    content: generateBase64Content(),
    fileName: generateFileName(),
    contentType: generateContentType(),
    fileSize: faker.number.int({ min: 1024, max: 1048576 }),
    ...overrides,
  };
};

/**
 * Создание списка факсимиле
 */
export const getValidFacsimileList = (count: number = 5): FacsimileListResponse => {
  return {
    data: Array.from({ length: count }, () => getValidFacsimileDetail()),
    meta: {
      totalCount: count,
      pageSize: count,
      pageNumber: 1,
      totalPages: 1,
    },
  };
};

/**
 * Создание факсимиле с конкретным lawyerId
 */
export const getFacsimileForLawyer = (lawyerId: string): FacsimileDetailDtoRs => {
  return getValidFacsimileDetail({ lawyerId });
};

/**
 * Создание факсимиле с определенным contentType
 */
export const getFacsimileWithContentType = (contentType: string): FacsimileDetailDtoRs => {
  return getValidFacsimileDetail({ contentType });
};

/**
 * Класс для построения факсимиле (Builder pattern)
 */
export class FacsimileFixtureBuilder {
  private facsimile: FacsimileDetailDtoRs;

  constructor() {
    this.facsimile = getValidFacsimileDetail();
  }

  withId(id: string): this {
    this.facsimile.id = id;
    return this;
  }

  withLawyerId(lawyerId: string): this {
    this.facsimile.lawyerId = lawyerId;
    return this;
  }

  withContent(content: string): this {
    this.facsimile.content = content;
    return this;
  }

  withFileName(fileName: string): this {
    this.facsimile.fileName = fileName;
    return this;
  }

  withContentType(contentType: string): this {
    this.facsimile.contentType = contentType;
    return this;
  }

  withFileSize(fileSize: number): this {
    this.facsimile.fileSize = fileSize;
    return this;
  }

  withCreatedAt(createdAt: string): this {
    this.facsimile.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: string): this {
    this.facsimile.updatedAt = updatedAt;
    return this;
  }

  build(): FacsimileDetailDtoRs {
    return this.facsimile;
  }

  buildCreateUpdate(): FacsimileCreateUpdateDtoRq {
    return {
      lawyerId: this.facsimile.lawyerId,
      content: this.facsimile.content,
      fileName: this.facsimile.fileName,
      contentType: this.facsimile.contentType,
      fileSize: this.facsimile.fileSize,
    };
  }
}

/**
 * Экспорт для совместимости
 */
export const buildTestFacsimile = getValidFacsimileDetail;
export const buildFacsimileForLawyer = getFacsimileForLawyer;