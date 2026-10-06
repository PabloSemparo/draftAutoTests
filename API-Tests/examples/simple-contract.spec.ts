/**
 * Простой пример использования утилиты createContract
 * 
 * Этот файл демонстрирует, как использовать утилиту createContract
 * для создания договоров и сохранения их ID в глобальную переменную CONTRACT
 * 
 * Запуск:
 * npx playwright test examples/simple-contract.spec.ts
 */

import { test, expect } from '@playwright/test';
import { createContract, getGlobalContractId } from '../test-utils';

// URL для создания договора
const BASE_URL = 'https://lc.preprod.mmk.local:8080';

// Пример тела запроса для создания договора (минимальный набор полей)
const minimalContractData = {
    companyId: "123e4567-e89b-12d3-a456-426614174000",
    registerName: "Реестр договоров",
    name: "Тестовый договор",
    contractNumber: "TEST-CONTRACT-001",
    signDate: new Date().toISOString(),
    loanAmount: 100000,
    clientId: "789e1234-e567-89ab-cdef-0123456789ab",
    employeeId: "abc12345-e567-89ab-cdef-0123456789ab",
    loanType: "SHORT_TERM",
    statusCreditPipeline: "APPROVED",
    fundingChannel: "DIRECT",
    receiveChannel: "ONLINE"
};

// Тест 1: Простое создание договора с минимальными данными
test('Создать договор с минимальными данными', async ({ request }) => {
    console.log('\n=== Тест 1: Создание договора с минимальными данными ===\n');
    
    // Создаем договор
    const contractId = await createContract(request, minimalContractData, BASE_URL);
    
    // Проверяем, что ID не пустой
    expect(contractId).toBeTruthy();
    expect(typeof contractId).toBe('string');
    expect(contractId.length).toBeGreaterThan(0);
    
    console.log(`✅ Договор успешно создан с ID: ${contractId}`);
});

// Тест 2: Проверка сохранения в глобальную переменную CONTRACT
test('Проверить сохранение в глобальную переменную CONTRACT', async ({ request }) => {
    console.log('\n=== Тест 2: Проверка глобальной переменной CONTRACT ===\n');
    
    // Создаем договор
    const contractId = await createContract(request, minimalContractData, BASE_URL);
    
    // Проверяем, что ID сохранен в глобальной переменной CONTRACT
    const globalContractId = getGlobalContractId();
    
    console.log(`Глобальный ID: ${globalContractId}`);
    console.log(`Созданный ID: ${contractId}`);
    
    expect(globalContractId).toBe(contractId);
    expect(globalContractId).toBeTruthy();
    
    console.log(`✅ ID договора сохранен в глобальной переменной CONTRACT: ${globalContractId}`);
});
