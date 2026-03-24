import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const baseUrl = process.env.BASE_URL || 'https://eq-debt-collection-stage.bdengi.ru';

test.describe('API Tests for Document Packages', () => {
    let packagesId: string;
    let firstItemId: string;

    test.describe('1 Copy - Тестовый NEED_FOR_GAS_IS_FALSE (DISTRICT) Суд указан', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание пакета документов для районного суда с NEED_FOR_GAS_IS_FALSE и указанным судом');
            await allure.tags('package-creation', 'district-court', 'gas-false');

            const startTime = Date.now();
            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: 'a1c067b4-9f2a-400b-a280-c15d48957785',
                    contractIds: ['32d01ae5-e8b4-4aa3-ad30-812456990764']
                }
            });
            const responseTime = Date.now() - startTime;

            await allure.step('Проверить статус код 201', async () => {
                expect(response.status()).toBe(201);
            });

            await allure.step('Проверить время ответа', async () => {
                expect(responseTime).toBeLessThan(2000);
            });

            await allure.step('Проверить Content-Type', async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType).toContain('application/json');
            });

            const responseBody = await response.json();

            await allure.step('Проверить наличие id в ответе', async () => {
                expect(responseBody).toHaveProperty('id');
            });

            await allure.step('Проверить схему ответа', async () => {
                expect(typeof responseBody.id).toBe('string');
            });

            // Сохраняем ID пакета для последующих тестов
            packagesId = responseBody.id;
            await allure.parameter('packagesId', packagesId);
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_1', async ({ request }) => {
            await allure.description('Получение документов внутри созданного пакета по ID');
            await allure.tags('get-documents', 'package-documents');

            const startTime = Date.now();
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const responseTime = Date.now() - startTime;

            await allure.step('Проверить статус код 200', async () => {
                expect(response.status()).toBe(200);
            });

            await allure.step('Проверить время ответа', async () => {
                expect(responseTime).toBeLessThan(200);
            });

            const responseBody = await response.json();

            await allure.step('Проверить структуру ответа', async () => {
                expect(responseBody).toHaveProperty('items');
                expect(responseBody).toHaveProperty('pageNumber');
                expect(responseBody).toHaveProperty('pageSize');
                expect(responseBody).toHaveProperty('hasMore');
                expect(responseBody).toHaveProperty('totalItems');
                expect(Array.isArray(responseBody.items)).toBe(true);
                expect(responseBody.items.length).toBeGreaterThan(0);
            });

            if (responseBody.items.length > 0) {
                await allure.step('Проверить обязательные поля в элементах', async () => {
                    responseBody.items.forEach((item: any, index: number) => {
                        expect(item).toHaveProperty('id');
                        expect(item).toHaveProperty('packageId');
                        expect(item).toHaveProperty('contractId');
                        expect(item).toHaveProperty('settingsPackageId');
                        expect(item).toHaveProperty('generalType');
                        expect(item).toHaveProperty('typeId');
                        expect(item).toHaveProperty('status');
                    });
                });

                const firstItem = responseBody.items[0];
                firstItemId = firstItem.id;

                await allure.step('Проверить settingsPackageId', async () => {
                    const expectedSettingsPackageId = '28362e06-08be-417c-8c26-4dc17333932e';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });

                await allure.step('Проверить формат UUID settingsPackageId', async () => {
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    expect(firstItem.settingsPackageId).toMatch(uuidRegex);
                });
            }
        });
    });

    test.describe('2 Copy - Тестовый NEED_FOR_GAS_IS_FALSE (DISTRICT) Дефолтный пакет', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание дефолтного пакета документов для районного суда с NEED_FOR_GAS_IS_FALSE');
            await allure.tags('package-creation', 'district-court', 'gas-false', 'default');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: 'a1c067b4-9f2a-400b-a280-c15d48957785',
                    contractIds: ['000090ee-c2f9-41d7-a223-e6a97b95768c']
                }
            });

            await allure.step('Проверить статус код 201', async () => {
                expect(response.status()).toBe(201);
            });

            const responseBody = await response.json();
            packagesId = responseBody.id;
            await allure.parameter('packagesId', packagesId);
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_2', async ({ request }) => {
            await allure.description('Получение документов дефолтного пакета по ID');
            await allure.tags('get-documents', 'package-documents', 'default');

            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];
                firstItemId = firstItem.id;

                await allure.step('Проверить settingsPackageId для дефолтного пакета', async () => {
                    const expectedSettingsPackageId = '69a04ba0-09e2-4fe1-b08e-9d207ecd4060';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });
    });

    test.describe('3 Copy - Тестовый NEED_FOR_GAS_IS_FALSE (MAGISTRATE) Суд указан', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание пакета документов для мирового суда с NEED_FOR_GAS_IS_FALSE и указанным судом');
            await allure.tags('package-creation', 'magistrate-court', 'gas-false');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: '893592f1-e26a-4d96-a230-66767c26e77a',
                    contractIds: ['00004a4d-358e-46e5-8ac5-33a4956f33b0']
                }
            });

            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            packagesId = responseBody.id;
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_3', async ({ request }) => {
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];

                await allure.step('Проверить settingsPackageId для мирового суда', async () => {
                    const expectedSettingsPackageId = 'b6628f16-4497-49ef-8227-8ef338d1a6ec';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });
    });

    test.describe('4 Copy - Тестовый NEED_FOR_GAS_IS_FALSE (MAGISTRATE) Дефолтный', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание дефолтного пакета документов для мирового суда с NEED_FOR_GAS_IS_FALSE');
            await allure.tags('package-creation', 'magistrate-court', 'gas-false', 'default');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: '893592f1-e26a-4d96-a230-66767c26e77a',
                    contractIds: ['000090ee-c2f9-41d7-a223-e6a97b95768c']
                }
            });

            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            packagesId = responseBody.id;
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_4', async ({ request }) => {
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];

                await allure.step('Проверить settingsPackageId для дефолтного мирового суда', async () => {
                    const expectedSettingsPackageId = '51ff0bc5-4c16-4071-8b79-185f8aed7fc4';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });
    });

    test.describe('5 Copy - Районный суд ФЭ на печать NEED_FOR_GAS_IS_TRUE Суд указан', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание пакета документов для районного суда с NEED_FOR_GAS_IS_TRUE и указанным судом');
            await allure.tags('package-creation', 'district-court', 'gas-true');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: '7be90c4b-487a-4366-9af4-35c1d8f7c937',
                    contractIds: ['5077f0d5-dc9d-48bb-bcfa-f579ccf78c35']
                }
            });

            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            packagesId = responseBody.id;
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_5', async ({ request }) => {
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];

                await allure.step('Проверить settingsPackageId для районного суда с GAS', async () => {
                    const expectedSettingsPackageId = 'c89842ff-1daf-4aba-9d6b-4b6884f4f0b7';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });
    });

    test.describe('6 Copy - Районный суд ФЭ на печать NEED_FOR_GAS_IS_TRUE Дефолтный', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание дефолтного пакета документов для районного суда с NEED_FOR_GAS_IS_TRUE');
            await allure.tags('package-creation', 'district-court', 'gas-true', 'default');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: '7be90c4b-487a-4366-9af4-35c1d8f7c937',
                    contractIds: ['127ee508-8acb-4993-82be-e01869241c64']
                }
            });

            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            packagesId = responseBody.id;
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_6', async ({ request }) => {
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];

                await allure.step('Проверить settingsPackageId для дефолтного районного суда с GAS', async () => {
                    const expectedSettingsPackageId = '021cb26c-1c96-4f59-80b7-53b1a75b449f';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });
    });

    test.describe('7 Copy - Мировой суд ФЭ на печать NEED_FOR_GAS_IS_TRUE Суд указан', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание пакета документов для мирового суда с NEED_FOR_GAS_IS_TRUE и указанным судом');
            await allure.tags('package-creation', 'magistrate-court', 'gas-true');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: 'a7d7af33-a42d-4a66-bb8a-40eb9c1bd21c',
                    contractIds: ['00004a4d-358e-46e5-8ac5-33a4956f33b0']
                }
            });

            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            packagesId = responseBody.id;
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_7', async ({ request }) => {
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];

                await allure.step('Проверить settingsPackageId для мирового суда с GAS', async () => {
                    const expectedSettingsPackageId = '5955e2c4-93ff-417a-8e2a-4f60ab8e400f';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });
    });

    test.describe('8 Copy - Мировой суд ФЭ на печать NEED_FOR_GAS_IS_TRUE Дефолтный', () => {
        test('[201 CODE] Пакет документов успешно создан', async ({ request }) => {
            await allure.description('Создание дефолтного пакета документов для мирового суда с NEED_FOR_GAS_IS_TRUE');
            await allure.tags('package-creation', 'magistrate-court', 'gas-true', 'default');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: 'a7d7af33-a42d-4a66-bb8a-40eb9c1bd21c',
                    contractIds: ['0000cf37-d804-4fe7-a725-58fa4567bfb4']
                }
            });

            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            packagesId = responseBody.id;
        });

        test('[200 CODE] Документы внутри пакета получены по его ID_8', async ({ request }) => {
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];

                await allure.step('Проверить settingsPackageId для дефолтного мирового суда с GAS', async () => {
                    const expectedSettingsPackageId = 'bfa913fd-63a8-4734-84ed-cb5da8eecd31';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });
    });

    test.describe('9 Copy - E2E тесты для мирового суда с GAS', () => {
        test('[201 CODE] Пакет документов успешно создан E2E', async ({ request }) => {
            await allure.description('E2E тест: создание пакета документов для мирового суда с NEED_FOR_GAS_IS_TRUE');
            await allure.tags('e2e', 'package-creation', 'magistrate-court', 'gas-true');

            const response = await request.post(`${baseUrl}/v1/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    packageTypeId: 'a7d7af33-a42d-4a66-bb8a-40eb9c1bd21c',
                    contractIds: ['00004a4d-358e-46e5-8ac5-33a4956f33b0']
                }
            });

            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            packagesId = responseBody.id;
        });

        test('[200 CODE] Конвертация документов пакета в PDF для отправки в ГАС E2E', async ({ request }) => {
            await allure.description('E2E тест: конвертация документов пакета в PDF формат для ГАС');
            await allure.tags('e2e', 'conversion', 'pdf', 'gas');

            const startTime = Date.now();
            const response = await request.post(`${baseUrl}/v1/packages/${packagesId}/convert`, {
                headers: {
                    'Accept': 'application/json'
                },
                data: {
                    courtLawyerId: '96f007da-441e-4dfd-9be0-36ccefe6e58b',
                    documentIds: []
                }
            });
            const responseTime = Date.now() - startTime;

            await allure.step('Проверить статус код 200', async () => {
                expect(response.status()).toBe(200);
            });

            await allure.step('Проверить время ответа', async () => {
                expect(responseTime).toBeLessThan(500);
            });

            await allure.step('Проверить наличие заголовка date', async () => {
                expect(response.headers()['date']).toBeDefined();
            });
        });

        test('[200 CODE] Получение документов внутри пакета E2E', async ({ request }) => {
            await allure.description('E2E тест: получение документов внутри созданного пакета');
            await allure.tags('e2e', 'get-documents');

            const startTime = Date.now();
            const response = await request.get(`${baseUrl}/v1/packages/${packagesId}/documents?pageNumber=0&pageSize=100`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const responseTime = Date.now() - startTime;

            await allure.step('Проверить время ответа', async () => {
                expect(responseTime).toBeLessThan(200);
            });

            const responseBody = await response.json();

            if (responseBody.items.length > 0) {
                const firstItem = responseBody.items[0];

                await allure.step('Проверить settingsPackageId в E2E сценарии', async () => {
                    const expectedSettingsPackageId = '5955e2c4-93ff-417a-8e2a-4f60ab8e400f';
                    expect(firstItem.settingsPackageId).toBe(expectedSettingsPackageId);
                });
            }
        });

        test('[200 CODE] Получение документов контракта для ГАС E2E', async ({ request }) => {
            await allure.description('E2E тест: получение документов контракта предназначенных для ГАС');
            await allure.tags('e2e', 'contract-documents', 'gas');

            const startTime = Date.now();
            const response = await request.get(`${baseUrl}/v1/contracts/00004a4d-358e-46e5-8ac5-33a4956f33b0/documents/gas?pageNumber=1&pageSize=25`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const responseTime = Date.now() - startTime;

            await allure.step('Проверить статус код 200', async () => {
                expect(response.status()).toBe(200);
            });

            await allure.step('Проверить время ответа', async () => {
                expect(responseTime).toBeLessThan(200);
            });

            await allure.step('Проверить Content-Type', async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType).toContain('application/json');
            });

            const responseBody = await response.json();

            if (responseBody.items && responseBody.items.length > 0) {
                await allure.step('Проверить обязательные свойства документов', async () => {
                    responseBody.items.forEach((item: any, index: number) => {
                        expect(item).toHaveProperty('id');
                        expect(item).toHaveProperty('packageId');
                        expect(item).toHaveProperty('contractId');
                        expect(item).toHaveProperty('settingsPackageId');
                        expect(item).toHaveProperty('generalType');
                        expect(item).toHaveProperty('typeId');
                        expect(item).toHaveProperty('fileId');
                        expect(item).toHaveProperty('fullFileName');
                        expect(item).toHaveProperty('createdAt');
                        expect(item).toHaveProperty('status');

                        // Дополнительные проверки типов
                        expect(typeof item.id).toBe('string');
                        expect(item.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
                    });
                });
            }
        });

        test('[200 CODE] Получение идентификаторов файлов документов E2E', async ({ request }) => {
            await allure.description('E2E тест: получение идентификаторов файлов документов контракта для ГАС');
            await allure.tags('e2e', 'file-ids', 'gas');

            const startTime = Date.now();
            const response = await request.get(`${baseUrl}/v1/contracts/00004a4d-358e-46e5-8ac5-33a4956f33b0/documents/gas/files/ids`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const responseTime = Date.now() - startTime;

            await allure.step('Проверить статус код 200', async () => {
                expect(response.status()).toBe(200);
            });

            await allure.step('Проверить время ответа', async () => {
                expect(responseTime).toBeLessThan(200);
            });

            await allure.step('Проверить Content-Type', async () => {
                const contentType = response.headers()['content-type'];
                expect(contentType).toContain('application/json');
            });

            const responseBody = await response.json();

            await allure.step('Проверить что ответ является массивом', async () => {
                expect(Array.isArray(responseBody)).toBe(true);
            });
        });
    });
});