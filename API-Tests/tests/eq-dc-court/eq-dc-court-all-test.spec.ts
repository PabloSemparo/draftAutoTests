import { test, expect } from "@playwright/test";

import { DcCourtService } from "../../services/dcCourtService";
import { expectJsonContentType } from "../../utils/assertions";

const VALID_BANKRUPT_PARAMS = {
  inn: process.env.EQ_DC_COURT_TEST_INN ?? "614334131355",
  fio: process.env.EQ_DC_COURT_TEST_FIO ?? "Старченко Владислав Владимирович",
  birthDate: process.env.EQ_DC_COURT_TEST_BIRTH_DATE ?? "1996-11-26",
};

const VALID_ADDRESS = process.env.EQ_DC_COURT_TEST_ADDRESS ?? "Ульяновск, проспект ульяновский 2";

test.describe("eq-dc-court API", () => {
  test("[200] Проверка на банкротство с валидными данными", async ({ request }) => {
    const courtService = new DcCourtService(request);

    const response = await courtService.checkBankrupt(VALID_BANKRUPT_PARAMS);

    expect(response.status).toBe(200);
    expectJsonContentType(response.headers);
    expect(response.body).toHaveProperty("status");
  });

  test("[200] Поиск судов возвращает список по валидному адресу", async ({ request }) => {
    const courtService = new DcCourtService(request);

    const response = await courtService.searchCourts(VALID_ADDRESS);

    expect(response.status).toBe(200);
    expectJsonContentType(response.headers);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("[401/403] Запрос без API-ключа отклоняется", async ({ request }) => {
    const courtService = new DcCourtService(request, { requireAuth: false, apiKey: undefined, token: undefined });

    const response = await courtService.checkBankrupt(VALID_BANKRUPT_PARAMS);

    expect([401, 403], "Service should reject unauthenticated requests").toContain(response.status);
  });

  const validationCases = [
    {
      name: "нет inn",
      params: { fio: VALID_BANKRUPT_PARAMS.fio, birthDate: VALID_BANKRUPT_PARAMS.birthDate },
    },
    {
      name: "нет fio",
      params: { inn: VALID_BANKRUPT_PARAMS.inn, birthDate: VALID_BANKRUPT_PARAMS.birthDate },
    },
    {
      name: "нет birthDate",
      params: { inn: VALID_BANKRUPT_PARAMS.inn, fio: VALID_BANKRUPT_PARAMS.fio },
    },
    {
      name: "невалидный inn",
      params: { ...VALID_BANKRUPT_PARAMS, inn: "invalid" },
    },
  ];

  for (const { name, params } of validationCases) {
    test(`[400/422] Validation: ${name}`, async ({ request }) => {
      const courtService = new DcCourtService(request);

      const response = await courtService.checkBankrupt(params);

      expect([400, 422], `Validation case '${name}' should fail`).toContain(response.status);
    });
  }
});
