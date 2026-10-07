import { test, expect } from "@playwright/test";

import { DcCourtService } from "../../services/dcCourtService";
import { expectJsonContentType } from "../../utils/assertions";

const searchAddress = process.env.EQ_DC_COURT_TEST_ADDRESS ?? "Ульяновск, проспект ульяновский 2";

test.describe("eq-dc-court /v1/courts/search", () => {
  test("[200] Возвращает список судов по адресу", async ({ request }) => {
    const courtService = new DcCourtService(request);

    const response = await courtService.searchCourts(searchAddress);

    expect(response.status).toBe(200);
    expectJsonContentType(response.headers);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("[401/403] Запрос без авторизации отклоняется", async ({ request }) => {
    const courtService = new DcCourtService(request, { requireAuth: false, apiKey: undefined, token: undefined });

    const response = await courtService.searchCourts(searchAddress);

    expect([401, 403]).toContain(response.status);
  });
});
