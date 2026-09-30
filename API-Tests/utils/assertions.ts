import { expect } from "@playwright/test";

import { PackageDetailsResponse } from "../models/debtCollection";

export function expectJsonContentType(headers: Record<string, string>): void {
  expect(headers["content-type"], "Content-Type should include application/json")
    .toContain("application/json");
}

export function expectPackageDetailsContract(
  body: PackageDetailsResponse
): void {
  expect(body).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      number: expect.any(Number),
      typeId: expect.any(String),
      statusCode: expect.any(String),
      createdAt: expect.any(String),
      includedContracts: expect.any(Array),
    })
  );

  expect(isNaN(new Date(body.createdAt).getTime()), "createdAt should be a valid date")
    .toBe(false);

  if (body.responsibleLawyerId !== null) {
    expect(typeof body.responsibleLawyerId).toBe("string");
    expect(body.responsibleLawyerId.length).toBeGreaterThan(0);
  }

  body.includedContracts.forEach((contractId, index) => {
    expect(typeof contractId, `includedContracts[${index}] should be string`).toBe("string");
  });
}
