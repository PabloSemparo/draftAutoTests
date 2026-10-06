/**
 * Экспорт всех утилит тестирования из одного места
 * 
 * Использование:
 * import { BaseTestUtils, CustomMatchers, boundaryValues, createContract, ContractUtils } from '../test-utils';
 */

export { BaseTestUtils } from './base-test-utils';
export { CustomMatchers } from './base-test-utils';
export { boundaryValues } from './boundary-values';
export { PackageAssertions, CourtAssertions, DebtImporterAssertions } from './assertions';

// Работа с договорами (Contracts)
export { 
    createContract, 
    getGlobalContractId, 
    setGlobalContractId, 
    ContractUtils,
    CreateContractRequest,
    CreateContractResponse,
    GLOBAL_CONTRACT_ID_KEY
} from './contract-utils';

// Типы для удобства
export type { BaseResponse, ListResponse, ApiError, ApiResponse } from '../fixtures/types';