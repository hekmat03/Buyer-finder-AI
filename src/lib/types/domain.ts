/**
 * Domain types for the qualification pipeline. These mirror the
 * Supabase schema (see supabase/migrations) and the enums the spec
 * requires — keeping the AI/scoring code decoupled from any one
 * database library.
 */

export type BuyerClassification = "CLEAN" | "NOISY" | "UNCLEAR";

export type BuyerIntent = "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW" | "UNCLEAR";

export type OpportunityLabel =
  | "HOT"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "REJECT";

export type FreshnessLevel = "FRESH" | "RECENT" | "STALE" | "UNCLEAR";

/** Sentinel strings used instead of null/guessed values, per spec §10. */
export const UNKNOWN = {
  NOT_PROVIDED: "Not provided",
  UNCLEAR: "Unclear",
  CONFLICTING: "Conflicting information",
} as const;

export interface RawCandidate {
  sourceId: string; // e.g. "reddit"
  externalId: string; // platform's own post/comment id
  url: string;
  title: string | null;
  text: string;
  author: string | null;
  createdAt: string | null; // ISO 8601, if known
  fetchedAt: string; // ISO 8601
  raw: Record<string, unknown>; // untouched provider payload, for debugging/reprocessing
}

export interface NormalizedCandidate extends RawCandidate {
  normalizedText: string; // lowercased, whitespace-collapsed, for hashing/dedup
  textHash: string;
}

export interface FreshnessAssessment {
  level: FreshnessLevel;
  daysOld: number | null;
  reason: string;
}

export interface BuyerInfo {
  name: string;
  place: string;
  whatsapp: string;
  phone: string;
  email: string;
  location: string;
  business: string;
}

export interface OpportunityInfo {
  buyerIntent: BuyerIntent;
  budget: string;
  service: string;
  source: string;
  opportunity: string;
  why: string;
  buyingSignalQuote: string;
  originalUrl: string;
}

export interface ScoreBreakdown {
  buyingIntent: number; // 0-30
  serviceMatch: number; // 0-20
  budgetEvidence: number; // 0-15
  urgencyFreshness: number; // 0-15
  contactability: number; // 0-10
  businessValue: number; // 0-10
  total: number; // 0-100
  label: OpportunityLabel;
}

export interface QualifiedOpportunity {
  id: string;
  candidate: NormalizedCandidate;
  buyerClassification: BuyerClassification;
  buyer: BuyerInfo;
  opportunity: OpportunityInfo;
  freshness: FreshnessAssessment;
  score: ScoreBreakdown;
  icebreaker: string | null;
  duplicateOfId: string | null;
}

export interface RejectedLead {
  candidate: NormalizedCandidate;
  buyerClassification: BuyerClassification;
  score: ScoreBreakdown;
  rejectionReason: string;
}
