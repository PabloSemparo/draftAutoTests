import { test, expect } from "@playwright/test";

import { DcCourtService } from "../../services/dcCourtService";

const validParams = {
  inn: process.env.EQ_DC_COURT_TEST_INN ?? "614334131355",
  fio: process.env.EQ_DC_COURT_TEST_FIO ?? "Старченко Владислав Владимирович",
  birthDate: process.env.EQ_DC_COURT_TEST_BIRTH_DATE ?? "1996-11-26",
};

test("eq-dc-court: [200] Проверка на банкротство с валидными данными", async ({ request }) => {
  const courtService = new DcCourtService(request);

  const response = await courtService.checkBankrupt(validParams);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("status");
});
