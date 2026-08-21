import type {
  NormalizedCandidate,
} from "@/lib/types/domain";

import {
  prepareQualification,
} from "@/lib/qualification/pre-qualification";

import {
  calculateOpportunityScore,
} from "@/lib/scoring/opportunity-score";

import {
  extractContactability,
} from "@/lib/contactability/extract-contactability";

import {
  verifyOpportunity,
} from "@/lib/verification/verify-opportunity";

import type {
  SupportedService,
} from "./service-match";

export async function prepareOpportunity(
  candidate: NormalizedCandidate,
  service: SupportedService
) {
  const qualification =
    prepareQualification(
      candidate,
      service
    );

  const contactability =
    extractContactability(
      `${candidate.title ?? ""}\n${candidate.text}`,
      candidate.author
    );

  const verification =
    await verifyOpportunity(candidate);

  const freshnessScore =
    qualification.freshness.level === "FRESH"
      ? 15
      : qualification.freshness.level === "RECENT"
        ? 11
        : qualification.freshness.level === "STALE"
          ? 3
          : 0;

  const score =
    calculateOpportunityScore(
      {
        summary: "Pre-AI qualification",
        problem:
          candidate.title ??
          "Not provided",
        requestedService: service,
        buyingIntent:
          qualification.buyingIntent.level,
        intentReason:
          qualification.buyingIntent.signals.join(
            ", "
          ) || "No explicit buying-intent signal.",
        serviceMatch:
          qualification.serviceMatch.level,
        budgetEvidence: "Not provided",
        timeline: "Not provided",
        businessValue: 5,
        contactability:
          contactability.level,
        riskFlags:
          verification.warnings,
        recommendedAction:
          qualification.qualification ===
          "HIGH_PRIORITY"
            ? "Review and contact promptly."
            : "Review before contacting.",
        qualificationNotes:
          qualification.reasons.join(" | "),
      },
      freshnessScore
    );

  return {
    candidate,
    qualification,
    contactability,
    verification,
    score,
    preparedAt: new Date().toISOString(),
  };
}