export interface QualificationInput {
  title: string | null;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string | null;
  requestedService: string;
}

export interface QualificationResult {
  summary: string;
  problem: string;
  requestedService: string;
  buyingIntent: "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW" | "UNCLEAR";
  intentReason: string;
  serviceMatch: "EXACT" | "STRONG" | "POSSIBLE" | "WEAK" | "NONE";
  budgetEvidence: string;
  timeline: string;
  businessValue: number;
  contactability:
    | "DIRECT_CONTACT"
    | "PUBLIC_CONTACT"
    | "PLATFORM_ONLY"
    | "NO_CONTACT"
    | "UNKNOWN";
  riskFlags: string[];
  recommendedAction: string;
  qualificationNotes: string;
}