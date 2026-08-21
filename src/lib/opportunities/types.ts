import type {
  ContactabilityLevel,
} from "@/lib/contactability/types";

import type {
  VerificationStatus,
} from "@/lib/verification/types";

export interface OpportunityRecord {
  id: string;
  sourceId: string;
  externalId: string;
  url: string;
  title: string | null;
  text: string;
  author: string | null;
  createdAt: string | null;
  fetchedAt: string;

  requestedService: string;

  buyingIntent: string;
  serviceMatch: string;

  score: number;
  classification: string;

  contactability: ContactabilityLevel;
  verificationStatus: VerificationStatus;

  duplicate: boolean;
  duplicateOfId: string | null;

  createdAtDb: string;
  updatedAtDb: string;
}

export interface SaveOpportunityInput {
  sourceId: string;
  externalId: string;
  url: string;
  title: string | null;
  text: string;
  author: string | null;
  createdAt: string | null;
  fetchedAt: string;

  requestedService: string;

  buyingIntent: string;
  serviceMatch: string;

  score: number;
  classification: string;

  contactability: ContactabilityLevel;
  verificationStatus: VerificationStatus;

  duplicate: boolean;
  duplicateOfId: string | null;
}