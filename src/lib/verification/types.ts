export type VerificationStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "UNVERIFIED"
  | "INVALID";

export interface VerificationResult {
  status: VerificationStatus;
  urlReachable: boolean;
  sourceAvailable: boolean;
  dateValid: boolean;
  confidence: number;
  warnings: string[];
  checkedAt: string;
}