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