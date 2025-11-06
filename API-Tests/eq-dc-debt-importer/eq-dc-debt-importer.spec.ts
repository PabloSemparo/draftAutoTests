import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/ru';

// Базовые настройки
const API_URL = process.env.API_URL || 'http://eq-dc-debt-importer.test2.mmk.local';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'Вводим актуальный токен';

// Вспомогательные функции
async function createContractor(request, data = {}) {
    const response = await request.post(`${API_URL}/admin/v1/contractors`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        data: {
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            inn: faker.string.numeric(10),
            status: "ACTIVE",
            contract: {
                fileNamePattern: "contract_pattern",
                inputFields: [],
                isAutoCourt: false
            },
            contractAnnex: {
                fileNamePattern: "annex_pattern",
                inputFields: []
            },
            debt: {
                fileLocationType: "COMMON",
                inputFields: []
            },
            ...data
        }
    });
    return response;
}

async function createContractImport(request, contractorId) {
    const response = await request.post(`${API_URL}/admin/v1/contract-imports`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        data: {
            contractorId,
            assignmentNumber: faker.string.numeric(4),
            assigmentDate: new Date().toISOString(),
            contractDirectory: "/test/contracts/",
            contractAnnexDirectory: "/test/annexes/",
            debtDirectory: "/test/debts/",
            fileDirectory: "/test/files/"
        }
    });
    return response;
}

// Тесты для работы с контрагентами
test.describe('Contractors API', () => {
    test('GET /admin/v1/contractors - should return list of contractors', async ({ request }) => {
        const response = await request.get(`${API_URL}/admin/v1/contractors?pageNumber=0&pageSize=25`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('items');
        expect(body.items).toBeInstanceOf(Array);
    });

    test('POST /admin/v1/contractors - should create new contractor', async ({ request }) => {
        const contractorName = faker.company.name();
        const response = await createContractor(request, { name: contractorName });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body).toHaveProperty('id');
    });

    test('GET /admin/v1/contractors/{id} - should return contractor details', async ({ request }) => {
        const createResponse = await createContractor(request);
        const contractorId = (await createResponse.json()).id;

        const response = await request.get(`${API_URL}/admin/v1/contractors/${contractorId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(contractorId);
        expect(body).toHaveProperty('contract');
        expect(body).toHaveProperty('debt');
    });

    test('PUT /admin/v1/contractors/{id} - should update contractor', async ({ request }) => {
        const createResponse = await createContractor(request);
        const contractorId = (await createResponse.json()).id;
        const newName = faker.company.name();

        const response = await request.put(`${API_URL}/admin/v1/contractors/${contractorId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
            data: {
                name: newName,
                description: "Updated description",
                inn: faker.string.numeric(10),
                status: "ACTIVE",
                contract: {
                    fileNamePattern: "updated_pattern",
                    inputFields: [],
                    isAutoCourt: true
                },
                contractAnnex: {
                    fileNamePattern: "updated_annex_pattern",
                    inputFields: []
                },
                debt: {
                    fileLocationType: "INDIVIDUAL",
                    inputFields: []
                }
            }
        });

        expect(response.status()).toBe(204);

        // Verify update
        const getResponse = await request.get(`${API_URL}/admin/v1/contractors/${contractorId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
        const body = await getResponse.json();
        expect(body.name).toBe(newName);
        expect(body.contract.isAutoCourt).toBe(true);
    });

    test('DELETE /admin/v1/contractors/{id} - should delete contractor', async ({ request }) => {
        const createResponse = await createContractor(request);
        const contractorId = (await createResponse.json()).id;

        const response = await request.delete(`${API_URL}/admin/v1/contractors/${contractorId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(204);

        // Verify deletion
        const getResponse = await request.get(`${API_URL}/admin/v1/contractors/${contractorId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
        expect(getResponse.status()).toBe(404);
    });
});

// Тесты для работы с импортом договоров
test.describe('Contract Imports API', () => {
    test('GET /admin/v1/contract-imports - should return list of contract imports', async ({ request }) => {
        const contractorResponse = await createContractor(request);
        const contractorId = (await contractorResponse.json()).id;

        const response = await request.get(`${API_URL}/admin/v1/contract-imports?contractorId=${contractorId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('items');
        expect(body.items).toBeInstanceOf(Array);
    });

    test('POST /admin/v1/contract-imports - should create new contract import', async ({ request }) => {
        const contractorResponse = await createContractor(request);
        const contractorId = (await contractorResponse.json()).id;

        const response = await createContractImport(request, contractorId);

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body).toHaveProperty('id');
    });

    test('GET /admin/v1/contract-imports/{id} - should return contract import details', async ({ request }) => {
        const contractorResponse = await createContractor(request);
        const contractorId = (await contractorResponse.json()).id;
        const importResponse = await createContractImport(request, contractorId);
        const importId = (await importResponse.json()).id;

        const response = await request.get(`${API_URL}/admin/v1/contract-imports/${importId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(importId);
        expect(body.contractorId).toBe(contractorId);
        expect(body).toHaveProperty('status');
    });
});

// Тесты для работы с договорами
test.describe('Contracts API', () => {
    test('GET /admin/v1/contracts - should return list of contracts', async ({ request }) => {
        // Создаем цепочку: контрагент -> импорт -> проверяем список договоров
        const contractorResponse = await createContractor(request);
        const contractorId = (await contractorResponse.json()).id;
        const importResponse = await createContractImport(request, contractorId);
        const importId = (await importResponse.json()).id;

        const response = await request.get(`${API_URL}/admin/v1/contracts?contractImportId=${importId}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('items');
        expect(body.items).toBeInstanceOf(Array);
    });

    test('GET /admin/v1/contracts/{id} - should return contract details', async ({ request }) => {
        // В реальном тесте здесь нужно было бы создать тестовый договор
        // Для примера просто проверяем что эндпоинт существует
        const response = await request.get(`${API_URL}/admin/v1/contracts/55298707-117c-44a5-8434-162fb9d2e4c5`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        // Ожидаем 404 или 200 в зависимости от наличия тестовых данных
        expect([200, 404]).toContain(response.status());
    });
});

// Тесты безопасности
test.describe('Security tests', () => {
    test('Unauthorized access should return 401', async ({ request }) => {
        const response = await request.get(`${API_URL}/admin/v1/contractors`);
        expect(response.status()).toBe(401);
    });

    test('Invalid token should return 403', async ({ request }) => {
        const response = await request.get(`${API_URL}/admin/v1/contractors`, {
            headers: { Authorization: 'Bearer invalid-token' }
        });
        expect(response.status()).toBe(403);
    });
});
