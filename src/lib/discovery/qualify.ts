import type {
  NormalizedCandidate,
  BuyerIntent,
} from "@/lib/types/domain";

import {
  assessBuyingIntent,
} from "./buying-intent";

import {
  assessFreshness,
} from "./freshness";

import {
  matchService,
  type SupportedService,
} from "./service-match";

export interface QualificationResult {
  candidate: NormalizedCandidate;

  buyingIntent: {
    level: BuyerIntent;
    score: number;
    signals: string[];
  };

  serviceMatch: {
    level: ReturnType<typeof matchService>["level"];
    score: number;
    matchedTerms: string[];
  };

  freshness: ReturnType<typeof assessFreshness>;

  preliminaryScore: number;

  qualification:
    | "HIGH_PRIORITY"
    | "POTENTIAL"
    | "LOW_PRIORITY"
    | "REJECT";

  reasons: string[];
}

/**
 * Deterministic pre-AI qualification.
 *
 * This stage intentionally runs before an LLM so that expensive
 * AI calls are made only for potentially useful opportunities.
 */
export function prepareQualification(
  candidate: NormalizedCandidate,
  service: SupportedService
): QualificationResult {
  const combinedText = [
    candidate.title ?? "",
    candidate.text,
  ].join("\n");

  const buyingIntent =
    assessBuyingIntent(combinedText);

  const serviceMatch =
    matchService(combinedText, service);

  const freshness =
    assessFreshness(candidate.createdAt);

  const reasons: string[] = [];

  if (buyingIntent.signals.length > 0) {
    reasons.push(
      `Buying-intent signals: ${buyingIntent.signals.join(", ")}`
    );
  }

  if (serviceMatch.matchedTerms.length > 0) {
    reasons.push(
      `Service terms: ${serviceMatch.matchedTerms.join(", ")}`
    );
  }

  reasons.push(
    `Freshness: ${freshness.level}`
  );

  const freshnessScore =
    freshness.level === "FRESH"
      ? 15
      : freshness.level === "RECENT"
        ? 11
        : freshness.level === "STALE"
          ? 3
          : 0;

  const preliminaryScore =
    buyingIntent.score +
    serviceMatch.score +
    freshnessScore;

  let qualification:
    | "HIGH_PRIORITY"
    | "POTENTIAL"
    | "LOW_PRIORITY"
    | "REJECT";

  if (
    buyingIntent.score >= 24 &&
    serviceMatch.score >= 10 &&
    freshness.level !== "STALE"
  ) {
    qualification = "HIGH_PRIORITY";
  } else if (
    buyingIntent.score >= 17 &&
    serviceMatch.score >= 10
  ) {
    qualification = "POTENTIAL";
  } else if (
    buyingIntent.score > 0 ||
    serviceMatch.score > 0
  ) {
    qualification = "LOW_PRIORITY";
  } else {
    qualification = "REJECT";
  }

  return {
    candidate,
    buyingIntent: {
      level: buyingIntent.intent,
      score: buyingIntent.score,
      signals: buyingIntent.signals,
    },
    serviceMatch: {
      level: serviceMatch.level,
      score: serviceMatch.score,
      matchedTerms: serviceMatch.matchedTerms,
    },
    freshness,
    preliminaryScore,
    qualification,
    reasons,
  };
}