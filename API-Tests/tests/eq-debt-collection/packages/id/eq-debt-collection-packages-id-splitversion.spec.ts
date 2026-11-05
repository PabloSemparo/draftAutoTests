import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('Детальная валидация ответа описания пакета документов', () => {
    let responseData: any;
    const PACKAGE_ID = '019a113e-58c5-79fe-8672-f4fea9cdc7dd';

    test.beforeEach(async ({ request }) => {
        allure.epic('EqvaCollection API');
        allure.feature('Получение деталей пакета документов по ID');
        allure.owner('API Team');
        allure.tag('package-validation');
        allure.tag('detailed-check');

        await allure.step(`Получение деталей пакета с ID: ${PACKAGE_ID}`, async () => {
            const response = await request.get(`/v1/packages/${PACKAGE_ID}`);

            await allure.step('Проверка статус кода ответа', async () => {
                expect(response.status(), 'Status code should be 200').toBe(200);
            });

            responseData = await response.json();

            await allure.step('Прикрепление данных ответа', async () => {
                allure.attachment('Package Details Response', JSON.stringify(responseData, null, 2), 'application/json');
                allure.attachment('Request Info',
                    `Package ID: ${PACKAGE_ID}\nStatus: ${response.status()}\nURL: /v1/packages/${PACKAGE_ID}`,
                    'text/plain'
                );
            });
        });
    });

    test('Response has all required fields', async () => {
        allure.story('Проверка обязательных полей');
        allure.severity('critical');
        allure.description('Валидация наличия всех обязательных полей в ответе пакета документов');

        const expectedKeys = ['id', 'number', 'typeId', 'statusCode', 'createdAt', 'responsibleLawyerId', 'includedContracts'];

        await allure.step('Проверка наличия всех обязательных полей', async () => {
            expectedKeys.forEach(key => {
                expect(responseData, `Response should have property: ${key}`).toHaveProperty(key);
            });
        });

        await allure.step('Прикрепление информации о полях', async () => {
            const actualKeys = Object.keys(responseData);
            const missingKeys = expectedKeys.filter(key => !actualKeys.includes(key));
            const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key));

            allure.attachment('Fields Validation',
                `Expected Fields: ${expectedKeys.join(', ')}\n` +
                `Actual Fields: ${actualKeys.join(', ')}\n` +
                `Missing Fields: ${missingKeys.length > 0 ? missingKeys.join(', ') : 'None'}\n` +
                `Extra Fields: ${extraKeys.length > 0 ? extraKeys.join(', ') : 'None'}`,
                'text/plain'
            );
        });
    });

    test('All fields have correct data types', async () => {
        allure.story('Проверка типов данных');
        allure.severity('critical');
        allure.description('Валидация корректности типов данных всех полей пакета документов');

        await allure.step('Проверка типов данных основных полей', async () => {
            expect(typeof responseData.id, 'id should be a string').toBe('string');
            expect(typeof responseData.number, 'number should be a number').toBe('number');
            expect(typeof responseData.typeId, 'typeId should be a string').toBe('string');
            expect(typeof responseData.statusCode, 'statusCode should be a string').toBe('string');
            expect(typeof responseData.createdAt, 'createdAt should be a string').toBe('string');
            expect(Array.isArray(responseData.includedContracts), 'includedContracts should be an array').toBe(true);
        });

        await allure.step('Проверка типа responsibleLawyerId', async () => {
            if (responseData.responsibleLawyerId !== null) {
                expect(typeof responseData.responsibleLawyerId, 'responsibleLawyerId should be a string when not null').toBe('string');
                allure.attachment('Responsible Lawyer Info',
                    `Type: string\nValue: ${responseData.responsibleLawyerId}\nLength: ${responseData.responsibleLawyerId.length}`,
                    'text/plain'
                );
            } else {
                allure.attachment('Responsible Lawyer Info', 'Type: null\nValue: null', 'text/plain');
            }
        });

        await allure.step('Прикрепление информации о типах данных', async () => {
            const typeInfo = {
                id: typeof responseData.id,
                number: typeof responseData.number,
                typeId: typeof responseData.typeId,
                statusCode: typeof responseData.statusCode,
                createdAt: typeof responseData.createdAt,
                responsibleLawyerId: responseData.responsibleLawyerId === null ? 'null' : typeof responseData.responsibleLawyerId,
                includedContracts: Array.isArray(responseData.includedContracts) ? 'array' : typeof responseData.includedContracts
            };

            allure.attachment('Data Types Info', JSON.stringify(typeInfo, null, 2), 'application/json');
        });
    });

    test('The createdAt field must be in a valid date format', async () => {
        allure.story('Валидация формата даты');
        allure.severity('normal');
        allure.description('Проверка что поле createdAt содержит корректную дату в формате ISO');

        await allure.step('Проверка наличия поля createdAt', async () => {
            expect(responseData, 'Response should have createdAt field').toHaveProperty('createdAt');
        });

        await allure.step('Валидация формата даты', async () => {
            const createdAtDate = new Date(responseData.createdAt);
            const isValidDate = !isNaN(createdAtDate.getTime());

            expect(isValidDate, 'createdAt should be a valid date').toBe(true);

            allure.attachment('Date Validation',
                `Original Value: ${responseData.createdAt}\n` +
                `Parsed Date: ${createdAtDate.toISOString()}\n` +
                `Is Valid: ${isValidDate}\n` +
                `Year: ${createdAtDate.getFullYear()}\n` +
                `Month: ${createdAtDate.getMonth() + 1}\n` +
                `Day: ${createdAtDate.getDate()}`,
                'text/plain'
            );
        });
    });

    test('Ensure includedContracts array is not null', async () => {
        allure.story('Проверка массива контрактов');
        allure.severity('normal');
        allure.description('Валидация что includedContracts является не-null массивом');

        await allure.step('Проверка структуры ответа', async () => {
            expect(responseData, 'Response should be defined').toBeDefined();
            expect(typeof responseData, 'Response should be an object').toBe('object');
        });

        await allure.step('Проверка массива includedContracts', async () => {
            expect(responseData.includedContracts, 'includedContracts should be defined').toBeDefined();
            expect(Array.isArray(responseData.includedContracts), 'includedContracts should be an array').toBe(true);
            expect(responseData.includedContracts, 'includedContracts should not be null').not.toBeNull();
        });

        await allure.step('Прикрепление информации о массиве контрактов', async () => {
            allure.attachment('Included Contracts Info',
                `Array Length: ${responseData.includedContracts.length}\n` +
                `Is Array: ${Array.isArray(responseData.includedContracts)}\n` +
                `Is Null: ${responseData.includedContracts === null}\n` +
                `First 5 Items: ${JSON.stringify(responseData.includedContracts.slice(0, 5))}`,
                'text/plain'
            );
        });
    });

    test('Validate that responsibleLawyerId is either a non-empty string or null', async () => {
        allure.story('Валидация ответственного юриста');
        allure.severity('normal');
        allure.description('Проверка что responsibleLawyerId либо не-пустая строка, либо null');

        await allure.step('Проверка наличия поля responsibleLawyerId', async () => {
            expect(responseData, 'Response should have responsibleLawyerId field').toHaveProperty('responsibleLawyerId');
        });

        await allure.step('Валидация значения responsibleLawyerId', async () => {
            if (typeof responseData.responsibleLawyerId === 'string') {
                expect(responseData.responsibleLawyerId.length, 'responsibleLawyerId should not be empty if it is a string').toBeGreaterThan(0);

                allure.attachment('Responsible Lawyer Validation',
                    `Type: string\nValue: ${responseData.responsibleLawyerId}\nLength: ${responseData.responsibleLawyerId.length}\nIs UUID: ${/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(responseData.responsibleLawyerId)}`,
                    'text/plain'
                );
            } else {
                expect(responseData.responsibleLawyerId, 'responsibleLawyerId should be null if not a string').toBeNull();
                allure.attachment('Responsible Lawyer Validation', 'Type: null\nValue: null', 'text/plain');
            }
        });
    });

    test('All includedContracts items are strings', async () => {
        allure.story('Валидация элементов массива контрактов');
        allure.severity('critical');
        allure.description('Проверка что все элементы в includedContracts являются строками');

        await allure.step('Проверка типов элементов массива', async () => {
            responseData.includedContracts.forEach((contract: any, index: number) => {
                expect(typeof contract, `Contract at index ${index} should be a string`).toBe('string');
            });
        });

        await allure.step('Прикрепление детальной информации о контрактах', async () => {
            // Исправленная версия без использования Set с spread оператором
            const contractTypes = responseData.includedContracts.map((contract: any) => typeof contract);
            const uniqueTypes: string[] = [];
            contractTypes.forEach((type: string) => {
                if (!uniqueTypes.includes(type)) {
                    uniqueTypes.push(type);
                }
            });

            const contractsInfo = {
                totalCount: responseData.includedContracts.length,
                sampleItems: responseData.includedContracts.slice(0, 10), // Первые 10 элементов
                allAreStrings: responseData.includedContracts.every((contract: any) => typeof contract === 'string'),
                uniqueTypes: uniqueTypes,
                sampleUUIDs: responseData.includedContracts
                    .filter((contract: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contract))
                    .slice(0, 5)
            };

            allure.attachment('Contracts Validation Details', JSON.stringify(contractsInfo, null, 2), 'application/json');
        });

        await allure.step('Дополнительные проверки формата контрактов', async () => {
            if (responseData.includedContracts.length > 0) {
                const firstContract = responseData.includedContracts[0];
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(firstContract);

                allure.attachment('Contract Format Check',
                    `First Contract: ${firstContract}\n` +
                    `Is UUID Format: ${isUUID}\n` +
                    `Length: ${firstContract.length}\n` +
                    `Total Contracts: ${responseData.includedContracts.length}`,
                    'text/plain'
                );
            }
        });
    });

    test('Comprehensive package validation summary', async () => {
        allure.story('Комплексная валидация пакета');
        allure.severity('critical');
        allure.description('Комплексная проверка всех аспектов пакета документов');

        await allure.step('Сводная проверка всех критериев', async () => {
            const validationSummary = {
                packageId: responseData.id,
                hasAllRequiredFields: ['id', 'number', 'typeId', 'statusCode', 'createdAt', 'responsibleLawyerId', 'includedContracts']
                    .every(key => responseData.hasOwnProperty(key)),
                dataTypesValid: {
                    id: typeof responseData.id === 'string',
                    number: typeof responseData.number === 'number',
                    typeId: typeof responseData.typeId === 'string',
                    statusCode: typeof responseData.statusCode === 'string',
                    createdAt: typeof responseData.createdAt === 'string',
                    responsibleLawyerId: responseData.responsibleLawyerId === null || typeof responseData.responsibleLawyerId === 'string',
                    includedContracts: Array.isArray(responseData.includedContracts)
                },
                createdAtValid: !isNaN(new Date(responseData.createdAt).getTime()),
                includedContractsValid: Array.isArray(responseData.includedContracts) &&
                    responseData.includedContracts !== null &&
                    responseData.includedContracts.every((contract: any) => typeof contract === 'string'),
                responsibleLawyerValid: responseData.responsibleLawyerId === null ||
                    (typeof responseData.responsibleLawyerId === 'string' && responseData.responsibleLawyerId.length > 0),
                overallStatus: 'PASS'
            };

            // Проверяем общий статус
            validationSummary.overallStatus =
                validationSummary.hasAllRequiredFields &&
                Object.values(validationSummary.dataTypesValid).every(Boolean) &&
                validationSummary.createdAtValid &&
                validationSummary.includedContractsValid &&
                validationSummary.responsibleLawyerValid ? 'PASS' : 'FAIL';

            allure.attachment('Comprehensive Validation Summary', JSON.stringify(validationSummary, null, 2), 'application/json');

            // Финальные проверки
            expect(validationSummary.overallStatus, 'All validation criteria should pass').toBe('PASS');
        });
    });
});