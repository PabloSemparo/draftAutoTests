import { test, expect } from '@playwright/test';

test.describe('API тесты', () => {
    const BASE_URL = '';
    test('the GraphQL API works', async ({ request }) => {
        const response = await request.post('https://countries.trevorblades.com/', {
            data: {
                query: `
        query {
          countries {
            code
            languages {
              code
            }
          }
        }
      `, // request the code for each country and language
            },
        });
        const body = await response.json();
        console.log(body); // This logs the API response
        expect(body.data.countries).toHaveLength(250);
    });
    test('Создание договора - проверка успешного ответа', async ({ request }) => {
        // 1. Отправка запроса на создание договора
        const response = await request.post(`${BASE_URL}/api/v1/contract`, {
            data: {
                companyId: "25b76a58-a913-475c-b276-075a829aace9",
                registerName: "registerName",
                name: "Name",
                contractOuterSystemId: "Н3343443",
                contractOuterSystemName: "default",
                importedContractPackageId: "8770d55c-69b4-44d3-9cc3-e2d7c426ffb4",
                contractNumber: "Номерок блатной",
                signDate: "2024-10-19T10:32:27.389Z",
                plannedFinishDate: "2024-11-25T10:32:27.389Z",
                dueDate: "2024-10-24T10:32:27.389Z",
                percentStopDate: "2025-11-20T10:32:27.389Z",
                statusCreditPipeline: "string",
                fundingChannel: "Online",
                receiveChannel: "Online",
                loanType: "PDL",
                microfinanceLineNumber: "АА 11894396",
                loanAmount: 1000.00,
                debtPercentRate: 1000.00,
                debtLoanTermDays: 4,
                debtAnnualInterestRate: 5,
                debtAmountDebtOnDatePay: 6,
                debtAmountInterestPayDateReturn: 7,
                debtAmountInterestPerDayReturn:80,
                debtAmountPercentPerDayStopInterest: 22,
                debtAmountPenaltyPerDayStopInterest: 33,
                debtAmountFinePerDayStopInterest: 444,
                paymentProvider: "Мандарин",
                clientId: "00004dd3-53cf-48fd-bb79-25fd64f8f6d4",
                employeeId: "9456857c-7e26-4d4e-8cf1-a2f4326d2c5e",
                bailiffDepartmentId: "08036ff0-0441-43ad-b272-1e3fbbfa3d29",
                fullRepaymentDebtDate: "2024-08-19T10:32:27.389Z",
                fullRepaymentDebtChannelName: "Client",
                fullRepaymentDebtRegistrationDate: "2024-08-19T10:32:27.389Z",
                documentsWithdrawalDate: "2024-08-19T10:32:27.389Z",
                collectionTerminateDecisionRegistrationDate: "2024-08-30T10:32:27.389Z",
                clientDeathDate: "2024-08-19T10:32:27.389Z",
                loanFraudulentRecognitionDate: "2024-08-19T10:32:27.389Z",
                clientBankruptcyRecognitionDate: "2024-08-19T10:32:27.389Z",
                collectionStoppedByCompanyDecisionDate: "2024-08-19T10:32:27.389Z",
                collectionTerminateReasonId: null,
                wronglyBroughtToCollection: true,
                comment: "string",
                pensionDepartmentId: null,
                stoppingAccrualsIdentifiers: [
                    "string"
                ],
                isRefinancing: true,
                cardNumber: "string",
                bki: {
                    nameBki: [
                        "Суськи-пуськи"
                    ],
                    idLoanBki: "dcbbf6ee-730b-11ed-ae25-d00d143fb042-1"
                },
                previousOwner: {
                    previousOwnerOfTheContract: "aaa2cefb-01eb-4983-8b44-41ba1da344e9",
                    contractSaleDate: "2024-11-23T10:32:27.389Z",
                    inn: "7713473700",
                    counteragentId: "e50116e1-34d1-4320-9b66-17fb3eb28b78",
                    cessionContractNumber: "string"
                },
            },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // 2. Проверка статуса ответа
        expect(response.status()).toBe(201);

        // 3. Проверка заголовков
        expect(response.headers()['content-type']).toContain('application/json');

        // 4. Проверка тела ответа
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('result');
        expect(responseBody.result).toHaveProperty('id');

        // 5. Проверка формата дат (пример)
        expect(responseBody.result).toHaveProperty('createdAt');
        const createdAt = new Date(responseBody.result.createdAt);
        expect(createdAt instanceof Date && !isNaN(createdAt.getTime())).toBeTruthy();
    });})
