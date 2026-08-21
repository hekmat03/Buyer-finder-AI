import type {
  BuyerClassification,
  BuyerInfo,
  BuyerIntent,
  NormalizedCandidate,
  OpportunityInfo,
} from "@/lib/types/domain";

export interface IntentAnalysis {
  intent: BuyerIntent;
  reasoning: string;
  buyingSignalQuote: string | null;
}

export interface BuyerClassificationResult {
  classification: BuyerClassification;
  reasoning: string;
}

export interface ExtractionResult {
  buyer: BuyerInfo;
  opportunity: OpportunityInfo;
}

/**
 * Provider-agnostic AI contract (spec §20). Every method must return
 * validated, schema-conformant output — see
 * src/lib/providers/ai-output-schema.ts. Implementations must never
 * fabricate budgets or contact details; when the source text doesn't
 * say, they must return the UNKNOWN sentinels from types/domain.ts.
 */
export interface AIProvider {
  readonly id: string;

  analyzeIntent(candidate: NormalizedCandidate): Promise<IntentAnalysis>;

  classifyBuyer(
    candidate: NormalizedCandidate
  ): Promise<BuyerClassificationResult>;

  extractOpportunity(
    candidate: NormalizedCandidate
  ): Promise<ExtractionResult>;

  generateIcebreaker(input: {
    candidate: NormalizedCandidate;
    opportunity: OpportunityInfo;
  }): Promise<string>;
}
