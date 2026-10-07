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

// Создание APIRequestContext с правильными настройками SSL
export {
    createAPIRequestContext,
    createAPIRequestContextWithBaseURL,
} from './apiContext';

// Legacy API Transport через Node.js https.request()
export {
    ApiTransport,
    ApiTransportResponse,
    NodeApiTransport,
    NodeApiTransport as NodeJsApiTransport,
    nodeApiTransportFactory as nodeApiTransportFactory,
} from './apiTransport';

// Типы для удобства - экспортируются из fixtures/types.ts
export type { BaseResponse, ListResponse, ApiError } from '../fixtures/types';