import { test, expect } from '@playwright/test';

const API_URL = 'http://eq-dc-debt-importer.test2.mmk.local/admin/v1/contractors';
const AUTH_TOKEN = '••••••'; // Заменить на реальный токен или использовать переменные окружения

test.describe('Тесты API контрагентов', () => {
    test('POST /contractors - Создание контрагента с валидными данными', async ({ request }) => {
        {
            "name": "Быстроденги",
            "description": "Быстроденьги",
            "inn": "5544332219",
            "status": "DRAFT",
            "contract": {
            "fileNamePattern": "(Приложение 2)",
                "inputFields":[
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000004",
                    "inputColumnHeaders": [
                        "Номер договора"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000005",
                    "inputColumnHeaders": [
                        "Дата заключения договора"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000006",
                    "inputColumnHeaders": [
                        "Дата образования задолженности",
                        "Срок займа  (в днях)"
                    ],
                    "calculateType": "DATE_PLUS_DAYS"
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000007",
                    "inputColumnHeaders": [
                        "Дата образования задолженности"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000009",
                    "inputColumnHeaders": [
                        "Наименование услуги"
                    ],
                    "calculateType": "MATCH_REGEXP_AND_REPLACE",
                    "calculateAction": "(Транш),^((?!Транш).)*$"
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000010",
                    "inputColumnHeaders": [
                        "Наименование услуги"
                    ],
                    "calculateType": "MATCH_REGEXP_AND_REPLACE",
                    "calculateAction": "(Транш),^((?!Транш).)*$"
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000011",
                    "inputColumnHeaders": [
                        "Наименование услуги"
                    ],
                    "calculateType": "MATCH_REGEXP_AND_REPLACE",
                    "calculateAction": "(Аннуитет|аннуитет),^((?!Аннуитет|аннуитет).)*$"
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000012",
                    "inputColumnHeaders": [
                        "Номер ДМЛ/УДМЛ"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000013",
                    "inputColumnHeaders": [
                        "Выданная сумма"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000014",
                    "inputColumnHeaders": [
                        "Провайдер"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000015",
                    "inputColumnHeaders": [
                        "Процентная ставка в день"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000016",
                    "inputColumnHeaders": [
                        "Срок займа  (в днях)"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000017",
                    "inputColumnHeaders": [
                        "Полная стоимость займа"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000024",
                    "inputColumnHeaders": [
                        "Идентификатор мирового суда"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000037",
                    "inputColumnHeaders": [
                        "Идентификатор районного суда"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000055",
                    "inputColumnHeaders": [
                        "Фамилия Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000056",
                    "inputColumnHeaders": [
                        "Имя Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000057",
                    "inputColumnHeaders": [
                        "Отчество Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000058",
                    "inputColumnHeaders": [
                        "Пол Должника"
                    ],
                    "calculateType": "MATCH_REGEXP_AND_REPLACE",
                    "calculateAction": "(M),(F)"
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000061",
                    "inputColumnHeaders": [
                        "Серия паспорта Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000062",
                    "inputColumnHeaders": [
                        "Номер паспорта Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000063",
                    "inputColumnHeaders": [
                        "Дата выдачи паспорта Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000064",
                    "inputColumnHeaders": [
                        "Код органа, выдавшего паспорт Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000065",
                    "inputColumnHeaders": [
                        "Кем выдан паспорт Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000066",
                    "inputColumnHeaders": [
                        "Место рождения Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000067",
                    "inputColumnHeaders": [
                        "Дата рождения Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000068",
                    "inputColumnHeaders": [
                        "ИНН Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000069",
                    "inputColumnHeaders": [
                        "СНИЛС Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000070",
                    "inputColumnHeaders": [
                        "Мобильный телефон Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000071",
                    "inputColumnHeaders": [
                        "Электронная почта (e-mail)"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000072",
                    "inputColumnHeaders": [
                        "Адрес регистрации Индекс"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000074",
                    "inputColumnHeaders": [
                        "Адрес регистрации Регион"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000076",
                    "inputColumnHeaders": [
                        "Адрес регистрации Город"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000077",
                    "inputColumnHeaders": [
                        "Адрес регистрации Улица"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000078",
                    "inputColumnHeaders": [
                        "Адрес регистрации Дом"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000079",
                    "inputColumnHeaders": [
                        "Адрес регистрации Корпус",
                        "Адрес регистрации Строение"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000080",
                    "inputColumnHeaders": [
                        "Адрес регистрации Квартира"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000081",
                    "inputColumnHeaders": [
                        "Служебный телефон Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000082",
                    "inputColumnHeaders": [
                        "Наименование организации"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000093",
                    "inputColumnHeaders": [
                        "Место работы Адрес"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000097",
                    "inputColumnHeaders": [
                        "Маска карты"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000103",
                    "inputColumnHeaders": [
                        "Фактический адрес Индекс"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000105",
                    "inputColumnHeaders": [
                        "Фактический адрес Регион"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000106",
                    "inputColumnHeaders": [
                        "Фактический адрес Город"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000107",
                    "inputColumnHeaders": [
                        "Фактический адрес Улица"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000109",
                    "inputColumnHeaders": [
                        "Фактический адрес Дом"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000110",
                    "inputColumnHeaders": [
                        "Фактический адрес Строение"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000109",
                    "inputColumnHeaders": [
                        "Фактический адрес Улица"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000111",
                    "inputColumnHeaders": [
                        "Фактический адрес Корпус"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000112",
                    "inputColumnHeaders": [
                        "Фактический адрес Квартира"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000113",
                    "inputColumnHeaders": [
                        "Телефон по месту постоянной регистрации Должника"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000114",
                    "inputColumnHeaders": [
                        "Телефон по фактическому адресу Должника"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000115",
                    "inputColumnHeaders": [
                        "Наименование бюро кредитных историй"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000116",
                    "inputColumnHeaders": [
                        "УИД"
                    ]
                },

                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000123",
                    "inputColumnHeaders": [
                        "Дата возврата средств по договору"
                    ]
                },
                {
                    "outputFieldId": "00000000-0000-0000-0001-000000000126",
                    "inputColumnHeaders": [
                        "Дата возврата средств по договору",
                        "Дата заключения договора"
                    ],
                    "calculateType": "DAYS_BETWEEN_DATES"
                }
            ],
                "isAutoCourt": false
        },
            "contractAnnex": {
            "fileNamePattern": "(Приложение 1)",
                "inputFields": [
                {
                    "outputFieldId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "inputColumnHeaders": [
                        "string"
                    ],
                    "calculateType": "CONCAT",
                    "calculateAction": "string"
                }
            ]
        },
            "debt": {
            "fileNamePattern": "(?=расчеты задол)",
                "fileLocationType": "COMMON",
                "inputFields": [
                {
                    "outputFieldId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "inputColumnHeaders": [
                        "string"
                    ],
                    "calculateType": "CONCAT",
                    "calculateAction": "string"
                }
            ]
        }
        };

        const response = await request.post(API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            data: requestBody
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.name).toBe(requestBody.name);
        expect(responseBody.inn).toBe(requestBody.inn);
        expect(responseBody.status).toBe(requestBody.status);
    });

    test('POST /contractors - Должен возвращать ошибку при невалидном токене', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'invalid_token'
            },
            data: {
                name: "Быстроденги",
                inn: "5544332219",
                status: "DRAFT"
            }
        });

        expect(response.status()).toBe(401);
    });

    test('POST /contractors - Должен возвращать ошибку при отсутствии обязательных полей', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            data: {
                // Отсутствуют обязательные поля name и inn
                status: "DRAFT"
            }
        });

        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('errors');
        expect(responseBody.errors).toContainEqual(expect.objectContaining({
            field: 'name'
        }));
        expect(responseBody.errors).toContainEqual(expect.objectContaining({
            field: 'inn'
        }));
    });

    test('POST /contractors - Должен возвращать ошибку при неверном формате ИНН', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            data: {
                name: "Быстроденги",
                inn: "invalid_inn",
                status: "DRAFT"
            }
        });

        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('errors');
        expect(responseBody.errors).toContainEqual(expect.objectContaining({
            field: 'inn'
        }));
    });

    test('POST /contractors - Должен возвращать ошибку при невалидном статусе', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            data: {
                name: "Быстроденги",
                inn: "5544332219",
                status: "INVALID_STATUS"
            }
        });

        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('errors');
        expect(responseBody.errors).toContainEqual(expect.objectContaining({
            field: 'status'
        }));
    });
})