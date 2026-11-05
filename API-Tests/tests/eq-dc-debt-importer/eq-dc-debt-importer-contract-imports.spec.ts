import { test, expect } from "@playwright/test";

import { apiConfig } from "../../config/apiConfig";
import { DebtImporterService, buildContractImportPayload, buildContractorPayload } from "../../services/debtImporterService";

test.describe.serial("eq-dc-debt-importer /admin/v1/contract-imports", () => {
  test("[200] Возвращает список импортов", async ({ request }) => {
    const service = new DebtImporterService(request);
    let contractorId = apiConfig.eqDcDebtImporter.defaultContractorId;

    if (!contractorId) {
      const contractor = await service.createContractor(buildContractorPayload());
      expect(contractor.status).toBe(201);
      contractorId = contractor.body.id;
    }

    const response = await service.getContractImports({
      contractorId,
      status: "DRAFT",
      pageNumber: 0,
      pageSize: 25,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("items");
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  test("[200] Возвращает детали импорта", async ({ request }) => {
    const service = new DebtImporterService(request);

    const contractor = await service.createContractor(buildContractorPayload());
    expect(contractor.status).toBe(201);

    const contractImport = await service.createContractImport(
      buildContractImportPayload(contractor.body.id)
    );
    expect(contractImport.status).toBe(201);

    const response = await service.getContractImportById(contractImport.body.id);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(contractImport.body.id);
    expect(response.body.contractorId).toBe(contractor.body.id);
  });
});

test.describe("eq-dc-debt-importer security", () => {
  test("[401] Ошибка авторизации без токена", async ({ request }) => {
    const service = new DebtImporterService(request, { requireAuth: false, token: undefined });

    const response = await service.getContractors();

    expect(response.status).toBe(401);
  });
});
