/**
 * Фикстуры для работы с договорами (Contracts)
 * 
 * Цель: централизованное хранилище для генерации тестовых данных договоров
 * 
 * Использование:
 * import { getValidContractPayload } from '../fixtures';
 * 
 * const contractData = getValidContractPayload({
 *     companyId: "123",
 *     contractNumber: "TEST-001"
 * });
 */

import { faker } from '@faker-js/faker/locale/ru';

/**
 * Интерфейс для опций генерации данных договора
 */
export interface ContractOptions {
    companyId?: string;
    registerName?: string;
    name?: string;
    contractNumber?: string;
    loanAmount?: number;
    debtPercentRate?: number;
    debtLoanTermDays?: number;
    debtAnnualInterestRate?: number;
    clientId?: string;
    employeeId?: string;
    contractOuterSystemId?: string;
    contractOuterSystemName?: string;
}

/**
 * Получить валидные данные для создания договора
 * 
 * @param options - Опции для генерации данных
 * @returns Объект с данными договора
 */
export function getValidContractPayload(options: ContractOptions = {}): any {
    const {
        companyId = faker.string.uuid(),
        registerName = `Реестр ${faker.company.name()}`,
        name = `Договор ${faker.company.name()}`,
        contractNumber = `CONTRACT-${faker.string.numeric(6)}`,
        loanAmount = faker.number.int({ min: 10000, max: 1000000 }),
        debtPercentRate = faker.number.int({ min: 10, max: 30 }),
        debtLoanTermDays = faker.number.int({ min: 30, max: 365 }),
        debtAnnualInterestRate = faker.number.int({ min: 8, max: 24 }),
        clientId = faker.string.uuid(),
        employeeId = faker.string.uuid(),
        contractOuterSystemId = faker.string.uuid(),
        contractOuterSystemName = `Система ${faker.company.name()}`,
    } = options;

    return {
        companyId,
        registerName,
        name,
        contractNumber,
        signDate: new Date().toISOString(),
        plannedFinishDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        percentStopDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
        statusCreditPipeline: "APPROVED",
        fundingChannel: "DIRECT",
        receiveChannel: "ONLINE",
        loanType: "SHORT_TERM",
        microfinanceLineNumber: faker.string.numeric(10),
        loanAmount,
        debtPercentRate,
        debtLoanTermDays,
        debtAnnualInterestRate,
        debtAmountDebtOnDatePay: loanAmount,
        debtAmountInterestPayDateReturn: Math.round(loanAmount * (debtAnnualInterestRate / 100) * (debtLoanTermDays / 365)),
        debtAmountInterestPerDayReturn: Math.round(loanAmount * (debtAnnualInterestRate / 100) / 365),
        debtAmountPercentPerDayStopInterest: Math.round(loanAmount * (debtPercentRate / 100) / 365),
        debtAmountPenaltyPerDayStopInterest: Math.round(loanAmount * 0.001), // 0.1% per day
        debtAmountFinePerDayStopInterest: Math.round(loanAmount * 0.002), // 0.2% per day
        paymentProvider: "PAYMENT_SYSTEM",
        clientId,
        employeeId,
        bailiffDepartmentId: faker.string.uuid(),
        fullRepaymentDebtDate: new Date(Date.now() + debtLoanTermDays * 24 * 60 * 60 * 1000).toISOString(),
        fullRepaymentDebtChannelName: "ONLINE",
        fullRepaymentDebtRegistrationDate: new Date().toISOString(),
        documentsWithdrawalDate: new Date().toISOString(),
        collectionTerminateDecisionRegistrationDate: null,
        clientDeathDate: null,
        loanFraudulentRecognitionDate: null,
        clientBankruptcyRecognitionDate: null,
        collectionStoppedByCompanyDecisionDate: null,
        collectionTerminateReasonId: null,
        wronglyBroughtToCollection: false,
        comment: faker.lorem.sentence(),
        pensionDepartmentId: null,
        stoppingAccrualsIdentifiers: [],
        isRefinancing: false,
        cardNumber: `SC ${faker.string.numeric(16)}`,
        bki: {
            nameBki: ["БКИ 1", "БКИ 2"],
            idLoanBki: faker.string.uuid()
        },
        previousOwner: {
            previousOwnerOfTheContract: null,
            contractSaleDate: null,
            inn: null,
            counteragentId: null,
            cessionContractNumber: null
        },
        contractNumber1C: null,
        interactionRefusal: false,
        monthlyPayment: Math.round(loanAmount / debtLoanTermDays),
        extendedContractExpirationDate: null,
        prolongationSign: false,
        pti: Math.round(debtAnnualInterestRate * 12),
        extendedLoanTerm: null,
        bailiffDepartmentCode: faker.string.numeric(5)
    };
}

/**
 * Получить данные договора для тестов с валидацией (400, 422)
 * 
 * @param options - Опции для генерации данных
 * @returns Объект с данными договора
 */
export function getInvalidContractPayload(options: Partial<any> = {}): any {
    const basePayload = getValidContractPayload();
    
    return {
        ...basePayload,
        ...options
    };
}

/**
 * Получить пустой payload для тестов без данных
 */
export function getEmptyContractPayload(): any {
    return {};
}