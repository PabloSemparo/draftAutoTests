/**
 * Фикстуры тестовых данных - централизованное хранилище для создания
 * валидных и валидируемых тестовых данных
 * 
 * Управление фикстурами:
 * - Используйте getValidDebtData() для создания валидных пакетов
 * - Используйте getValidDebtPackage() для создания полных пакетов
 * - Используйте getValidContractPayload() для создания данных договоров
 * - Переопределяйте поля через overrides для кастомизации
 */

// Используем ContractorFixture и ContractorPayload из debtImporter.ts
// Экспортируем типы из eq-dc/facsimile.ts
export type { FacsimileDetailDtoRs, FacsimileCreateUpdateDtoRq, FacsimileListResponse } from './eq-dc/facsimile';
export type { PackageDetailsResponse, PackagePayload, PackageListResponse, PackageStatusUpdatePayload } from './eq-dc/package';

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
  buildTestPackage,
  buildTestContract,
  buildDebtPackage,
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

// Фикстуры для договоров (Contracts)
export {
  getValidContractPayload,
  getInvalidContractPayload,
  getEmptyContractPayload,
  ContractOptions,
} from './contract';

// Типы для договоров - экспортируются из test-utils/contract-utils.ts