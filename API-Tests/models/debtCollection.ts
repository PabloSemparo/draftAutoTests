export interface PackageDetailsResponse {
  id: string;
  number: number;
  typeId: string;
  statusCode: string;
  createdAt: string;
  responsibleLawyerId: string | null;
  includedContracts: string[];
}
