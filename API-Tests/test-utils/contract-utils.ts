/**
 * Утилиты для работы с договорами (Contracts)
 * 
 * Цель: централизованное хранилище для всех операций с договорами
 * 
 * Использование:
 * import { createContract, getContractId, setGlobalContractId } from '../test-utils/contract-utils';
 */

import { NodeApiTransport } from './apiTransport';

/**
 * Bearer token для авторизации в Legacy API
 * Можно переопределить через переменную окружения CONTRACTS_API_TOKEN
 */
const AUTH_TOKEN = process.env.CONTRACTS_API_TOKEN || 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkYyQ0M5RDBBMTYyQTUwNDcwRkExOTUzRkNEM0I4MEVBRTlBODA3MjBSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IjhzeWRDaFlxVUVjUG9aVV96VHVBNnVtb0J5QSJ9.eyJuYmYiOjE3MzQwNzE0NjcsImV4cCI6MTczNDA3NTA2NywiaXNzIjoiaHR0cHM6Ly9lcXZhbnRhLmNvbS8iLCJjbGllbnRfaWQiOiJsY19jbGllbnQiLCJzdWIiOiJiZWE1NDQ1OS0zYWJiLTQxNTAtYmZkOC1iYTY4YzZkNTg3MGMiLCJhdXRoX3RpbWUiOjE3MzQwNzE0NjcsImlkcCI6ImxvY2FsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AbWFpbC5jb20iLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IlpQVDZPNURGRlZXVVRYREkzRUNVSDdPWk1HRVE0S0FRIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6Iis3MTAxMDIyMjMzNDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJqdGkiOiI5QjUyNEY1N0IxODJCODE5MDU0MkU2ODgxOTAwQzU1QSIsImlhdCI6MTczNDA3MTQ2Nywic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.bE205aWpTEIG3vjrq7tlhn9bq15utls4MkPVHCIpxCgwl-NJBqhP90cb6UQz7yuZfDoCc9VP8ZVbry-gf0nVuMRWy-NqKbn7tFPMc3I6wBisWsm4jbHcOp655cTmWRTxV0AHAfxT-x1ZC5aA2c2pu2w-dGiGM2un2PRVBzPN6hnSKr3p310x0DWn2sQWKys-mAeC5EHWAZ6d9hExuV2haCLSr0YPfSvRxU4qhifvC50Da-f2-DD0S8wJSV7mOyxNXviHuDgPY_8Tw9OQ_3kiPBETBPbQuvjqNQZUAiSHuRdlM0YG5Io7aXK3Mr-MrfNNJlVpPg_DcGs7n564ctcbuA';

/**
 * Получить заголовки авторизации
 */
function getAuthHeaders(): Record<string, string> {
    return {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}

/**
 * Интерфейс для тела запроса создания договора
 */
export interface CreateContractRequest {
    companyId?: string;
    registerName?: string;
    name?: string;
    contractOuterSystemId?: string;
    contractOuterSystemName?: string;
    importedContractPackageId?: string;
    contractNumber?: string;
    signDate?: string;
    plannedFinishDate?: string;
    dueDate?: string;
    percentStopDate?: string;
    statusCreditPipeline?: string;
    fundingChannel?: string;
    receiveChannel?: string;
    loanType?: string;
    microfinanceLineNumber?: string;
    loanAmount?: number;
    debtPercentRate?: number;
    debtLoanTermDays?: number;
    debtAnnualInterestRate?: number;
    debtAmountDebtOnDatePay?: number;
    debtAmountInterestPayDateReturn?: number;
    debtAmountInterestPerDayReturn?: number;
    debtAmountPercentPerDayStopInterest?: number;
    debtAmountPenaltyPerDayStopInterest?: number;
    debtAmountFinePerDayStopInterest?: number;
    paymentProvider?: string;
    clientId?: string;
    employeeId?: string;
    bailiffDepartmentId?: string;
    fullRepaymentDebtDate?: string;
    fullRepaymentDebtChannelName?: string;
    fullRepaymentDebtRegistrationDate?: string;
    documentsWithdrawalDate?: string;
    collectionTerminateDecisionRegistrationDate?: string;
    clientDeathDate?: string;
    loanFraudulentRecognitionDate?: string;
    clientBankruptcyRecognitionDate?: string;
    collectionStoppedByCompanyDecisionDate?: string;
    collectionTerminateReasonId?: null;
    wronglyBroughtToCollection?: boolean;
    comment?: string;
    pensionDepartmentId?: null;
    stoppingAccrualsIdentifiers?: string[];
    isRefinancing?: boolean;
    cardNumber?: string;

    bki?: {
        nameBki?: string[];
        idLoanBki?: string;
    };

    previousOwner?: {
        previousOwnerOfTheContract?: string;
        contractSaleDate?: null;
        inn?: string;
        counteragentId?: string;
        cessionContractNumber?: string;
    };

    contractNumber1C?: null;
    interactionRefusal?: boolean;
    monthlyPayment?: number;
    extendedContractExpirationDate?: string;
    prolongationSign?: boolean;
    pti?: number;
    extendedLoanTerm?: number;
    bailiffDepartmentCode?: string;
}

/**
 * Интерфейс для тела ответа создания договора
 */
export interface CreateContractResponse {
    result: {
        id: string;
    };
}

/**
 * Глобальная переменная для хранения ID созданного договора
 * Используется test.info() для хранения контекста в пределах одного теста
 */
export const GLOBAL_CONTRACT_ID_KEY = 'contractId';

/**
 * Базовый URL для Legacy API (lc.preprod.mmk.local:8080)
 * Использует NodeApiTransport с SSL_OP_LEGACY_SERVER_CONNECT для обхода проблем с renegotiation
 */
const LEGACY_API_BASE_URL = 'https://lc.preprod.mmk.local:8080';

/**
 * Создает договор через Legacy API (NodeApiTransport) и сохраняет его ID в глобальную переменную CONTRACT
 * 
 * Использует NodeApiTransport с SSL_OP_LEGACY_SERVER_CONNECT для обхода ошибки
 * "unsafe legacy renegotiation disabled" при работе с lc.preprod.mmk.local:8080
 * 
 * @param contractData - Данные для создания договора (тело запроса)
 * @param baseUrl - Базовый URL API (по умолчанию из env или дефолтный)
 * @returns Promise<string> - ID созданного договора
 * 
 * @example
 * const contractId = await createContract({
 *     companyId: "123",
 *     contractNumber: "TEST-001",
 *     loanAmount: 100000
 * });
 */
export async function createContract(
    contractData: CreateContractRequest,
    baseUrl?: string
): Promise<string> {
    // Используем переданный baseUrl или значение по умолчанию
    const url = baseUrl || process.env.BASE_URL || LEGACY_API_BASE_URL;
    const endpoint = '/api/v1/contract';
    
    console.log(`🚀 Создание договора на ${url}${endpoint}`);
    
    // Проверяем, используем ли мы Legacy API (lc.preprod.mmk.local:8080)
    const isLegacyApi = url.includes('lc.preprod.mmk.local:8080');
    
    let contractId: string;
    
    if (isLegacyApi) {
        // Используем NodeApiTransport для Legacy API
        console.log(`🔧 Используем NodeApiTransport для Legacy API (lc.preprod.mmk.local:8080)`);
        
        const transport = new NodeApiTransport(url);
        
        const response = await transport.post<CreateContractResponse>(endpoint, contractData, getAuthHeaders());
        
        if (!response.body || !response.body.result?.id) {
            throw new Error(`Ошибка при создании договора: статус ${response.status}, response: ${response.rawText}`);
        }
        
        contractId = response.body.result.id;
        
        console.log(`✅ Договор успешно создан через NodeApiTransport с ID: ${contractId}`);
    } else {
        // Используем Playwright APIRequestContext для обычного API
        console.log(`🔧 Используем Playwright APIRequestContext для обычного API`);
        
        const { createAPIRequestContextWithBaseURL } = await import('./apiContext');
        const apiContext = await createAPIRequestContextWithBaseURL(url);
        const response = await apiContext.post(endpoint, {
            data: contractData,
            headers: getAuthHeaders()
        });
        
        // Проверка статуса ответа
        if (response.status() !== 200 && response.status() !== 201) {
            throw new Error(`Ошибка при создании договора: статус ${response.status()}`);
        }
        
        // Парсинг ответа
        const responseBody: CreateContractResponse = await response.json();
        
        if (!responseBody?.result?.id) {
            throw new Error('В ответе не найдено поле result.id');
        }
        
        contractId = responseBody.result.id;
        
        console.log(`✅ Договор успешно создан через Playwright APIRequestContext с ID: ${contractId}`);
    }
    
    // Сохранение ID в глобальную переменную CONTRACT (в контексте теста)
    if (typeof process !== 'undefined' && process['testInfo']) {
        // Для глобального доступа (если используется в нескольких тестах)
        (global as any).CONTRACT = contractId;
    }
    
    // Сохранение через test.info() для использования в рамках одного теста
    // Это работает только если функция вызывается внутри теста
    try {
        // Проверяем, есть ли доступ к test.info()
        // Это сработает, если функция вызывается внутри теста
        const currentTestInfo = (global as any).__PLAYWRIGHT_TEST_INFO__;
        if (currentTestInfo) {
            currentTestInfo.contractId = contractId;
        }
    } catch (e) {
        // Если test.info недоступен, продолжаем без сохранения через него
        console.log('test.info недоступен, сохраняем только в глобальную переменную');
    }
    
    console.log(`✅ Договор успешно создан с ID: ${contractId}`);
    
    // Сохраняем ID в глобальную переменную CONTRACT для использования в других тестах
    (global as any).CONTRACT = contractId;
    console.log(`🌍 CONTRACT сохранен в глобальную переменную: ${contractId}`);
    
    return contractId;
}

/**
 * Получает ID договора из глобальной переменной CONTRACT
 * 
 * @returns string | null - ID договора или null, если не установлен
 */
export function getGlobalContractId(): string | null {
    return (global as any).CONTRACT || null;
}

/**
 * Устанавливает ID договора в глобальную переменную CONTRACT
 * 
 * @param contractId - ID договора для сохранения
 */
export function setGlobalContractId(contractId: string): void {
    (global as any).CONTRACT = contractId;
    console.log(`CONTRACT ID установлен в глобальную переменную: ${contractId}`);
}

/**
 * Утилиты для работы с договорами
 */
export const ContractUtils = {
    createContract,
    getGlobalContractId,
    setGlobalContractId
};


