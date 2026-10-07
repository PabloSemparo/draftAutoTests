/**
 * Пример использования утилиты createContract
 * 
 * Этот файл демонстрирует, как использовать утилиту createContract
 * для создания договоров и сохранения их ID в глобальную переменную CONTRACT
 */

import { test, expect } from '@playwright/test';
import { createContract, getGlobalContractId, setGlobalContractId, ContractUtils } from '../test-utils';

// Константы для тестов
const BASE_URL = 'https://lc.preprod.mmk.local:8080';

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