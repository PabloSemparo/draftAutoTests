import { test, expect } from "@playwright/test";

import contractorData from "../../tests-data/contractorData.json";
import type { ContractorPayload } from "../../models/debtImporter";
import { DebtImporterService } from "../../services/debtImporterService";

test.describe.serial("eq-dc-debt-importer /admin/v1/contractors", () => {
  test("[201] Создание контрагента с валидными данными", async ({ request }) => {
    const service = new DebtImporterService(request);

    const response = await service.createContractor(contractorData as ContractorPayload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  test("[401/403] Ошибка при невалидном токене", async ({ request }) => {
    const service = new DebtImporterService(request, { token: "invalid-token" });

    const response = await service.createContractor(contractorData as ContractorPayload);

    expect([401, 403]).toContain(response.status);
  });

  test("[400] Ошибка при отсутствии обязательных полей", async ({ request }) => {
    const service = new DebtImporterService(request);

    const response = await service.createContractor({ status: "DRAFT" } as ContractorPayload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  test("[400] Ошибка при неверном формате ИНН", async ({ request }) => {
    const service = new DebtImporterService(request);
    const invalidPayload = {
      ...(contractorData as ContractorPayload),
      inn: "invalid_inn",
    };

    const response = await service.createContractor(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  test("[400] Ошибка при невалидном статусе", async ({ request }) => {
    const service = new DebtImporterService(request);
    const invalidPayload = {
      ...(contractorData as ContractorPayload),
      status: "INVALID_STATUS",
    };

    const response = await service.createContractor(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
