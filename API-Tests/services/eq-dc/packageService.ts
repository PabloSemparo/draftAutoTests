/**
 * Service layer для Package API (eq-debt-collection)
 */

import type { APIRequestContext } from '@playwright/test';
import { apiConfig, requireBaseUrl, requireSecret } from '../../config/apiConfig';
import { ApiClient, ApiClientOptions } from '../../utils/apiClient';
import { ApiResponse } from '../../utils/apiResponse';
import {
  PackageDetailsResponse,
  PackagePayload,
  PackageListResponse,
  PackageStatusUpdatePayload,
  PackageResponse,
  ErrorDtoRs,
  FileInfoPayload,
  ExcludeDocumentPayload,
  ConvertToGasPayload,
  PrintPayload,
  RecreateDocumentsPayload,
  RecreateSingleDocumentPayload,
} from '../../models/eq-dc/package';

interface PackageServiceOptions extends ApiClientOptions {
  requireAuth?: boolean;
}

export class PackageService extends ApiClient {
  constructor(
    request: APIRequestContext,
    options: PackageServiceOptions = {}
  ) {
    const requireAuth = options.requireAuth ?? true;

    super(request, {
      baseUrl: requireBaseUrl(apiConfig.eqDebtCollection.baseUrl, 'EQ_DEBT_COLLECTION_BASE_URL', 'eq-debt-collection'),
      token: requireAuth
        ? requireSecret(apiConfig.eqDcCourt.token, 'AUTH_TOKEN', 'eq-debt-collection')
        : options.token,
      ...options,
    });
  }

  /**
   * Получить список всех пакетов
   */
  async getPackages(
    params: Record<string, string | number | boolean> = { pageNumber: 0, pageSize: 25 }
  ): Promise<ApiResponse<PackageListResponse>> {
    return this.get<PackageListResponse>({
      url: '/api/v1/packages',
      params,
    });
  }

  /**
   * Получить пакет по ID
   */
  async getPackageById(id: string): Promise<ApiResponse<PackageDetailsResponse>> {
    return this.get<PackageDetailsResponse>({
      url: `/api/v1/packages/${id}`,
    });
  }

  /**
   * Создать новый пакет
   */
  async createPackage(payload: PackagePayload): Promise<ApiResponse<PackageResponse>> {
    return this.post<PackageResponse>({
      url: '/api/v1/packages',
      body: payload,
    });
  }

  /**
   * Обновить пакет по ID
   */
  async updatePackage(id: string, payload: PackagePayload): Promise<ApiResponse<PackageResponse>> {
    return this.put<PackageResponse>({
      url: `/api/v1/packages/${id}`,
      body: payload,
    });
  }

  /**
   * Удалить пакет по ID
   */
  async deletePackage(id: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>({
      url: `/api/v1/packages/${id}`,
    });
  }

  /**
   * Обновить статус пакета
   */
  async updatePackageStatus(id: string, payload: PackageStatusUpdatePayload): Promise<ApiResponse<PackageResponse>> {
    return this.patch<PackageResponse>({
      url: `/api/v1/packages/${id}/status`,
      body: payload,
    });
  }

  /**
   * Обновить информацию о файле документа внутри пакета
   */
  async updateDocumentFileInfo(
    packageId: string,
    documentId: string,
    payload: FileInfoPayload
  ): Promise<ApiResponse<unknown>> {
    return this.put<unknown>({
      url: `/api/v1/packages/${packageId}/documents/${documentId}/file-info`,
      body: payload,
    });
  }

  /**
   * Исключить документ из пакета
   */
  async excludeDocumentFromPackage(
    packageId: string,
    documentId: string,
    payload: ExcludeDocumentPayload = {}
  ): Promise<ApiResponse<unknown>> {
    return this.put<unknown>({
      url: `/api/v1/packages/${packageId}/documents/${documentId}/exclude`,
      body: payload,
    });
  }

  /**
   * Конвертировать документ пакета в PDF для отправки в ГАС
   */
  async convertToGas(
    packageId: string,
    documentId: string,
    payload: ConvertToGasPayload = {}
  ): Promise<ApiResponse<unknown>> {
    return this.post<unknown>({
      url: `/api/v1/packages/${packageId}/documents/${documentId}/convert/gas`,
      body: payload,
    });
  }

  /**
   * Пересоздать документы для пакета
   */
  async recreatePackageDocuments(
    packageId: string,
    payload: RecreateDocumentsPayload = { allDocuments: true }
  ): Promise<ApiResponse<unknown>> {
    return this.post<unknown>({
      url: `/api/v1/packages/${packageId}/documents/recreate`,
      body: payload,
    });
  }

  /**
   * Отправить пакет на печать
   */
  async printPackage(packageId: string, payload: PrintPayload = {}): Promise<ApiResponse<unknown>> {
    return this.post<unknown>({
      url: `/api/v1/packages/${packageId}/print`,
      body: payload,
    });
  }

  /**
   * Подготовить пакет для ГАС (конвертация всех документов в PDF)
   */
  async prepareForGas(packageId: string, payload: ConvertToGasPayload = {}): Promise<ApiResponse<unknown>> {
    return this.post<unknown>({
      url: `/api/v1/packages/${packageId}/prepare-for-gas`,
      body: payload,
    });
  }

  /**
   * Пересоздать конкретный документ внутри пакета
   */
  async recreateSingleDocument(
    packageId: string,
    documentId: string,
    payload: RecreateSingleDocumentPayload
  ): Promise<ApiResponse<unknown>> {
    return this.post<unknown>({
      url: `/api/v1/packages/${packageId}/documents/${documentId}/recreate`,
      body: payload,
    });
  }

  /**
   * Обработка ошибок
   */
  protected handleErrorResponse(response: any): ErrorDtoRs {
    return {
      status: {
        code: response.status?.code || 'UNKNOWN_ERROR',
        description: response.status?.description || 'Неизвестная ошибка',
      },
      errors: response.errors,
      details: response.details,
    };
  }
}