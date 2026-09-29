/**
 * Единая точка чтения окружения для API-автотестов.
 *
 * Цель: убрать хардкод host/token из spec-файлов и сделать поведение одинаковым
 * для локального запуска и CI. Значения загружаются в playwright.config.ts через
 * env_settings/.env.stage или приходят как CI/CD variables.
 */
export const apiConfig = {
  eqLegalCollection: {
    baseUrl: getRequiredEnv(
      "EQ_LEGAL_COLLECTION_BASE_URL",
      process.env.BASE_URL,
      "BASE_URL or EQ_LEGAL_COLLECTION_BASE_URL is required for eq-legal-collection tests"
    ),
    apiKey: getOptionalEnv("API_KEY"),
  },

  eqDebtCollection: {
    baseUrl: getRequiredEnv(
      "EQ_DEBT_COLLECTION_BASE_URL",
      process.env.STAGING_BASE_URL ?? process.env.BASE_URL,
      "STAGING_BASE_URL, BASE_URL or EQ_DEBT_COLLECTION_BASE_URL is required for eq-debt-collection tests"
    ),
    defaultPackageId: getOptionalEnv("PACKAGE_ID") ?? getOptionalEnv("PACKAGES_ID"),
  },

  eqDcCourt: {
    baseUrl: getRequiredEnv(
      "EQ_DC_COURT_BASE_URL",
      process.env.EQ_DC_COURT_BASE_URL,
      "EQ_DC_COURT_BASE_URL is required for eq-dc-court tests"
    ),
    apiKey: getOptionalEnv("EQ_DC_COURT_API_KEY") ?? getOptionalEnv("API_KEY"),
    token: getOptionalEnv("EQ_DC_COURT_TOKEN") ?? getOptionalEnv("AUTH_TOKEN"),
  },

  eqDcDebtImporter: {
    baseUrl: getRequiredEnv(
      "EQ_DC_DEBT_IMPORTER_BASE_URL",
      process.env.API_URL,
      "API_URL or EQ_DC_DEBT_IMPORTER_BASE_URL is required for eq-dc-debt-importer tests"
    ),
    token: getOptionalEnv("EQ_DC_DEBT_IMPORTER_TOKEN") ?? getOptionalEnv("AUTH_TOKEN"),
    defaultContractorId: getOptionalEnv("CONTRACTOR_ID"),
    defaultContractImportId: getOptionalEnv("CONTRACT_IMPORT_ID"),
    defaultContractId: getOptionalEnv("CONTRACT_ID"),
  },
};

export function getRequiredEnv(
  name: string,
  value: string | undefined,
  message = `${name} is required`
): string {
  const normalized = (process.env[name] ?? value)?.trim();

  if (!normalized) {
    return "";
  }

  return normalized.replace(/\/+$/, "");
}

export function requireBaseUrl(
  value: string,
  envName: string,
  serviceName: string
): string {
  if (!value) {
    throw new Error(
      `${envName} is required for ${serviceName}. ` +
      `Set it in env_settings/.env.stage locally or as a CI/CD variable.`
    );
  }

  return value;
}

export function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function requireSecret(
  value: string | undefined,
  envName: string,
  serviceName: string
): string {
  if (!value) {
    throw new Error(
      `${envName} is required for ${serviceName}. ` +
      `Set it in env_settings/.env.stage locally or as a masked CI/CD variable.`
    );
  }

  return value;
}
