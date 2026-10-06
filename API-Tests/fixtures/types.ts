/**
 * Типы для фикстур тестовых данных
 */

// Фикстура для построения объектов с возможностью переопределения
export interface FixtureBuilder<T> {
  required(): T;
  withOverrides(overrides: Partial<T>): T;
}

// Фикстура для контракторов
export interface ContractorFixture extends FixtureBuilder<ContractorPayload> {
  withStatus(status: string): ContractorPayload;
  withCustomContract(contract: Record<string, unknown>): ContractorPayload;
}

// Фикстура для пакетов долгов
export interface PackageFixture extends FixtureBuilder<unknown> {
  withStatus(statusCode: string): unknown;
  withContracts(contractIds: string[]): unknown;
}

// Фикстура для контрактов
export interface ContractFixture extends FixtureBuilder<Record<string, unknown>> {
  withInputFields(fields: Record<string, unknown>[]): ContractFixture;
  withCalculateType(type: string): ContractFixture;
}

// Фикстура для поиска судов
export interface CourtSearchFixture extends FixtureBuilder<unknown> {
  withInn(inn: string): unknown;
  withFio(fio: string): unknown;
  withBirthDate(date: string): unknown;
}

// Базовый интерфейс для ответов
export interface BaseResponse {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Интерфейс для списка с пагинацией
export interface ListResponse<T> {
  data: T[];
  meta: {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
  };
}

// Интерфейс для ошибок API
export interface ApiError {
  key: string;
  code: string;
  description: string;
}

// Интерфейс для ответа API
export interface ApiResponse<T = unknown> {
  status: {
    code: string;
    description: string;
  };
  data?: T;
  errors?: ApiError[];
  details?: Record<string, unknown>;
}

// Типы для договоров (Contracts)
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

// Интерфейс для ответа создания договора
export interface CreateContractResponse {
  result: {
    id: string;
  };
}