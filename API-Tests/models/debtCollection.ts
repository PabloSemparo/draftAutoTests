// Используем типы из models/eq-dc/package.ts
// Дублирующиеся типы перенесены в models/eq-dc/package.ts для централизованного управления

// Для обратной совместимости экспортируем типы из models/eq-dc/package.ts
export type { PackageDetailsResponse, PackagePayload, PackageListResponse, PackageStatusUpdatePayload, PackageResponse } from './eq-dc/package';
