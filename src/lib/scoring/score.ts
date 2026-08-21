import type {
  BuyerClassification,
  BuyerIntent,
  FreshnessLevel,
  OpportunityLabel,
  ScoreBreakdown,
} from "@/lib/types/domain";

export interface ScoringInput {
  buyerClassification: BuyerClassification;
  buyerIntent: BuyerIntent;
  /** True if the extracted service maps to web dev / AI agent / AI automation. */
  serviceIsDirectMatch: boolean;
  /** True if the service is related but not a direct match (e.g. "general software"). */
  serviceIsRelated: boolean;
  /** True if an explicit budget figure was extracted. */
  hasExplicitBudget: boolean;
  /** True if there's a clear commercial project even without a stated budget. */
  hasClearCommercialProject: boolean;
  freshness: FreshnessLevel;
  daysOld: number | null;
  /** True if the post/profile immediately shows an urgent deadline or active hiring. */
  hasImmediateUrgency: boolean;
  hasPublicEmailPhoneOrWhatsapp: boolean;
  hasIdentifiablePublicProfile: boolean;
  isDifficultButPossibleToContact: boolean;
  isStrongCommercialBuyer: boolean;
  isLegitimateSmallerBusiness: boolean;
}

function scoreBuyingIntent(input: ScoringInput): number {
  // NOISY buyers can't score above "weak/no intent" on this axis even
  // if the wording looks eager — the overall-total cap below is the
  // hard backstop, this just keeps the component itself honest.
  if (input.buyerClassification === "NOISY") return 5;
  switch (input.buyerIntent) {
    case "VERY_HIGH":
      return 30;
    case "HIGH":
      return 25;
    case "MEDIUM":
      return 15;
    case "LOW":
      return 5;
    case "UNCLEAR":
    default:
      return 0;
  }
}

function scoreServiceMatch(input: ScoringInput): number {
  if (input.serviceIsDirectMatch) return 20;
  if (input.serviceIsRelated) return 15;
  return 5;
}

function scoreBudgetEvidence(input: ScoringInput): number {
  if (input.hasExplicitBudget) return 15;
  if (input.hasClearCommercialProject) return 11;
  return 3;
}

function scoreUrgencyFreshness(input: ScoringInput): number {
  if (input.hasImmediateUrgency) return 15;
  if (input.daysOld === null) return input.freshness === "UNCLEAR" ? 2 : 5;
  if (input.daysOld <= 7) return 12;
  if (input.daysOld <= 30) return 7;
  return 2;
}

function scoreContactability(input: ScoringInput): number {
  if (input.hasPublicEmailPhoneOrWhatsapp) return 10;
  if (input.hasIdentifiablePublicProfile) return 8;
  if (input.isDifficultButPossibleToContact) return 4;
  return 1;
}

function scoreBusinessValue(input: ScoringInput): number {
  if (input.isStrongCommercialBuyer) return 10;
  if (input.isLegitimateSmallerBusiness) return 8;
  if (input.buyerClassification === "NOISY") return 1;
  return 5;
}

function labelForScore(total: number): OpportunityLabel {
  if (total >= 90) return "HOT";
  if (total >= 75) return "HIGH";
  if (total >= 55) return "MEDIUM";
  if (total >= 30) return "LOW";
  return "REJECT";
}

/**
 * Pure, deterministic scoring per spec §12–13. The AI layer only
 * supplies structured signals (intent, classification, extracted
 * fields); this function alone decides the number and the label, so
 * a given input always produces the same score.
 */
export function scoreOpportunity(input: ScoringInput): ScoreBreakdown {
  const buyingIntent = scoreBuyingIntent(input);
  const serviceMatch = scoreServiceMatch(input);
  const budgetEvidence = scoreBudgetEvidence(input);
  const urgencyFreshness = scoreUrgencyFreshness(input);
  const contactability = scoreContactability(input);
  const businessValue = scoreBusinessValue(input);

  let total =
    buyingIntent +
    serviceMatch +
    budgetEvidence +
    urgencyFreshness +
    contactability +
    businessValue;

  // §7: NOISY buyers are hard-capped at 45 regardless of other signals.
  if (input.buyerClassification === "NOISY") {
    total = Math.min(total, 45);
  }

  // §9: content older than 90 days is rejected outright unless the
  // caller has already established the project is still active
  // (hasImmediateUrgency acts as that override signal here).
  if (
    input.daysOld !== null &&
    input.daysOld > 90 &&
    !input.hasImmediateUrgency
  ) {
    total = Math.min(total, 29);
  }

  total = Math.max(0, Math.min(100, total));

  return {
    buyingIntent,
    serviceMatch,
    budgetEvidence,
    urgencyFreshness,
    contactability,
    businessValue,
    total,
    label: labelForScore(total),
  };
    }
