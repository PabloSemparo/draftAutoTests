/**
 * Пример использования утилиты createContract
 * 
 * Этот файл демонстрирует, как использовать утилиту createContract
 * для создания договоров и сохранения их ID в глобальную переменную CONTRACT
 * 
 * Авторизация:
 * Для работы с Legacy API используется Bearer token
 * Token можно установить в переменной окружения CONTRACTS_API_TOKEN
 */

import { test, expect } from '@playwright/test';
import { createContract, getGlobalContractId, setGlobalContractId, ContractUtils } from '../test-utils';

// Константы для тестов
const BASE_URL = 'https://lc.preprod.mmk.local:8080';

/**
 * Bearer token для авторизации в Legacy API
 * Можно переопределить через переменную окружения CONTRACTS_API_TOKEN
 */
const AUTH_TOKEN = process.env.CONTRACTS_API_TOKEN || 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkYyQ0M5RDBBMTYyQTUwNDcwRkExOTUzRkNEM0I4MEVBRTlBODA3MjBSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IjhzeWRDaFlxVUVjUG9aVV96VHVBNnVtb0J5QSJ9.eyJuYmYiOjE3MzQwNzE0NjcsImV4cCI6MTczNDA3NTA2NywiaXNzIjoiaHR0cHM6Ly9lcXZhbnRhLmNvbS8iLCJjbGllbnRfaWQiOiJsY19jbGllbnQiLCJzdWIiOiJiZWE1NDQ1OS0zYWJiLTQxNTAtYmZkOC1iYTY4YzZkNTg3MGMiLCJhdXRoX3RpbWUiOjE3MzQwNzE0NjcsImlkcCI6ImxvY2FsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AbWFpbC5jb20iLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IlpQVDZPNURGRlZXVVRYREkzRUNVSDdPWk1HRVE0S0FRIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6Iis3MTAxMDIyMjMzNDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJqdGkiOiI5QjUyNEY1N0IxODJCODE5MDU0MkU2ODgxOTAwQzU1QSIsImlhdCI6MTczNDA3MTQ2Nywic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.bE205aWpTEIG3vjrq7tlhn9bq15utls4MkPVHCIpxCgwl-NJBqhP90cb6UQz7yuZfDoCc9VP8ZVbry-gf0nVuMRWy-NqKbn7tFPMc3I6wBisWsm4jbHcOp655cTmWRTxV0AHAfxT-x1ZC5aA2c2pu2w-dGiGM2un2PRVBzPN6hnSKr3p310x0DWn2sQWKys-mAeC5EHWAZ6d9hExuV2haCLSr0YPfSvRxU4qhifvC50Da-f2-DD0S8wJSV7mOyxNXviHuDgPY_8Tw9OQ_3kiPBETBPbQuvjqNQZUAiSHuRdlM0YG5Io7aXK3Mr-MrfNNJlVpPg_DcGs7n564ctcbuA';

// Пример тела запроса для создания договора
const contractData = {
    companyId: "123e4567-e89b-12d3-a456-426614174000",
    registerName: "Реестр договоров",
    name: "Тестовый договор",
    contractNumber: "TEST-CONTRACT-001",
    signDate: new Date().toISOString(),
    plannedFinishDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    loanAmount: 100000,
    debtPercentRate: 15,
    debtLoanTermDays: 180,
    debtAnnualInterestRate: 12,
    clientId: "789e1234-e567-89ab-cdef-0123456789ab",
    employeeId: "abc12345-e567-89ab-cdef-0123456789ab",
    loanType: "SHORT_TERM",
    statusCreditPipeline: "APPROVED",
    fundingChannel: "DIRECT",
    receiveChannel: "ONLINE",
    paymentProvider: "PAYMENT_SYSTEM",
    monthlyPayment: 5000,
    pti: 30,
    bailiffDepartmentCode: "12345"
};

// Тест 1: Простое создание договора с возвратом ID
test('Пример 1: Простое создание договора', async ({ request }) => {
    console.log('\n=== Пример 1: Простое создание договора ===\n');
    
    // Создаем договор (без передачи request - используется внутренний APIRequestContext)
    const contractId = await createContract(contractData, BASE_URL);
    
    // Проверяем, что ID не пустой
    expect(contractId).toBeTruthy();
    expect(typeof contractId).toBe('string');
    
    console.log(`✅ Договор успешно создан с ID: ${contractId}`);
});

// Тест 2: Использование глобальной переменной CONTRACT
test('Пример 2: Использование глобальной переменной CONTRACT', async ({ request }) => {
    console.log('\n=== Пример 2: Использование глобальной переменной CONTRACT ===\n');
    
    // Создаем договор (без передачи request - используется внутренний APIRequestContext)
    const contractId = await createContract(contractData, BASE_URL);
    
    // Проверяем, что ID сохранен в глобальной переменной CONTRACT
    const globalContractId = getGlobalContractId();
    expect(globalContractId).toBe(contractId);
    
    console.log(`✅ ID договора сохранен в глобальной переменной CONTRACT: ${globalContractId}`);
});

// Тест 3: Ручное управление глобальной переменной
test('Пример 3: Ручное управление глобальной переменной', async ({ request }) => {
    console.log('\n=== Пример 3: Ручное управление глобальной переменной ===\n');
    
    // Создаем договор (без передачи request - используется внутренний APIRequestContext)
    const contractId = await createContract(contractData, BASE_URL);
    
    // Устанавливаем ID вручную (если нужно переопределить)
    setGlobalContractId(contractId);
    
    // Проверяем, что ID установлен
    expect(getGlobalContractId()).toBe(contractId);
    
    console.log(`✅ ID договора установлен вручную: ${getGlobalContractId()}`);
});

// Тест 4: Использование в нескольких тестах (цепочка тестов)
// ВНИМАНИЕ: Для работы этой функциональности нужно настроить глобальное состояние
// между тестами, например, через глобальные файлы или базу данных
test('Пример 4: Использование ID в следующем тесте', async ({ request }) => {
    console.log('\n=== Пример 4: Использование ID в следующем тесте ===\n');
    
    // Создаем договор (без передачи request - используется внутренний APIRequestContext)
    const contractId = await createContract(contractData, BASE_URL);
    
    // Сохраняем ID для использования в следующем тесте
    // В реальном сценарии это можно сделать через:
    // 1. Глобальный файл с ID
    // 2. Переменную окружения
    // 3. Базу данных
    // 4. Allure attachments
    
    // Для примера используем глобальную переменную
    (global as any).LAST_CREATED_CONTRACT_ID = contractId;
    
    console.log(`✅ ID договора сохранен для следующего теста: ${contractId}`);
});

// Тест 5: Использование ContractUtils
test('Пример 5: Использование ContractUtils', async ({ request }) => {
    console.log('\n=== Пример 5: Использование ContractUtils ===\n');
    
    // Создаем договор через ContractUtils (без передачи request - используется внутренний APIRequestContext)
    const contractId = await ContractUtils.createContract(contractData, BASE_URL);
    
    // Проверяем, что ID сохранен
    expect(ContractUtils.getGlobalContractId()).toBe(contractId);
    
    console.log(`✅ ID договора сохранен через ContractUtils: ${contractId}`);
});

// Тест 6: Валидация полей ответа
test('Пример 6: Валидация полей ответа', async ({ request }) => {
    console.log('\n=== Пример 6: Валидация полей ответа ===\n');
    
    // Создаем договор (без передачи request - используется внутренний APIRequestContext)
    const contractId = await createContract(contractData, BASE_URL);
    
    // Проверяем формат ID (GUID)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(contractId).toMatch(guidRegex);
    
    console.log(`✅ ID договора валиден (GUID): ${contractId}`);
});