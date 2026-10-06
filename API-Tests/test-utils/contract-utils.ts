/**
 * Утилиты для работы с договорами (Contracts)
 * 
 * Цель: централизованное хранилище для всех операций с договорами
 * 
 * Использование:
 * import { createContract, getContractId, setGlobalContractId } from '../test-utils/contract-utils';
 */

/**
 * Интерфейс для тела запроса создания договора
 */
export interface CreateContractRequest {
    type?: string;
    properties?: {
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
    };
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
 * Создает договор через API и сохраняет его ID в глобальную переменную CONTRACT
 * 
 * @param request - Playwright request context
 * @param contractData - Данные для создания договора (тело запроса)
 * @param baseUrl - Базовый URL API (по умолчанию из env или дефолтный)
 * @returns Promise<string> - ID созданного договора
 * 
 * @example
 * const contractId = await createContract(request, {
 *     companyId: "123",
 *     contractNumber: "TEST-001",
 *     loanAmount: 100000
 * });
 */
export async function createContract(
    request: any,
    contractData: CreateContractRequest,
    baseUrl?: string
): Promise<string> {
    const url = baseUrl || process.env.BASE_URL || 'https://lc.preprod.mmk.local:8080';
    const endpoint = '/api/v1/contract';
    
    console.log(`🚀 Создание договора на ${url}${endpoint}`);
    
    const response = await request.post(`${url}${endpoint}`, {
        data: contractData
    });
    
    // Проверка статуса ответа
    if (response.status() !== 200 && response.status() !== 201) {
        throw new Error(`Ошибка при создании договора: статус ${response.status()}`);
    }
    
    // Парсинг ответа
    const responseBody: CreateContractResponse = await response.json();
    
    // Извлечение ID из response.result.id
    if (!responseBody?.result?.id) {
        throw new Error('В ответе не найдено поле result.id');
    }
    
    const contractId = responseBody.result.id;
    
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