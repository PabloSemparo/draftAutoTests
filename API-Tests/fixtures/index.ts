/**
 * Фикстуры тестовых данных - централизованное хранилище для создания
 * валидных и валидируемых тестовых данных
 * 
 * Управление фикстурами:
 * - Используйте getValidDebtData() для создания валидных пакетов
 * - Используйте getValidDebtPackage() для создания полных пакетов
 * - Переопределяйте поля через overrides для кастомизации
 */

export type { ContractorPayload, ContractorFixture } from './debtImporter';
export type { PackageFixture, ContractFixture } from './debtCollection';
export type { CourtSearchFixture } from './dcCourt';
export type { FacsimileDetailDtoRs, FacsimileCreateUpdateDtoRq } from './eq-dc/facsimile';
export type { PackageDetailsResponse, PackagePayload, PackageListResponse } from './eq-dc/package';

export {
  getValidContractorPayload,
  getValidContractImportPayload,
  getContractorWithStatus,
  getContractorWithCustomContract,
} from './debtImporter';

export {
  getValidDebtData,
  getValidDebtPackage,
  getValidContract,
  getDebtPackageWithStatus,
  getDebtPackageWithContracts,
} from './debtCollection';

export {
  getValidCourtSearchItem,
  getValidBankruptCheckParams,
  getValidCourtData,
} from './dcCourt';

// OpenAPI фикстуры
export {
  getValidFacsimileDetail,
  getValidFacsimileCreateUpdate,
  getValidFacsimileList,
  getFacsimileForLawyer,
  FacsimileFixtureBuilder,
} from './eq-dc/facsimile';

export {
  getValidPackage,
  getValidPackagePayload,
  getPackageWithStatus,
  getPackageWithContracts,
  getPackageStatusUpdatePayload,
  getValidPackageList,
  getPackageForLawyer,
  PackageFixtureBuilder,
} from './eq-dc/package';