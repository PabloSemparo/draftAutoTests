import type { APIRequestContext } from "@playwright/test";

import { apiConfig, requireBaseUrl } from "../config/apiConfig";
import { ApiClient, ApiClientOptions } from "../utils/apiClient";
import { ApiResponse } from "../utils/apiResponse";
import { PackageDetailsResponse } from "../models/debtCollection";

export class DebtCollectionService extends ApiClient {
  constructor(request: APIRequestContext, options: ApiClientOptions = {}) {
    super(request, {
      baseUrl: requireBaseUrl(apiConfig.eqDebtCollection.baseUrl, "EQ_DEBT_COLLECTION_BASE_URL", "eq-debt-collection"),
      ...options,
    });
  }

  async getPackageById(
    packageId: string
  ): Promise<ApiResponse<PackageDetailsResponse>> {
    return this.get<PackageDetailsResponse>({
      url: `/v1/packages/${packageId}`,
    });
  }
}
