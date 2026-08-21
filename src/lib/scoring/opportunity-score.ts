import type {
  QualificationResult,
} from "@/lib/qualification/types";

export interface OpportunityScoreBreakdown {
  buyingIntent: number;
  serviceMatch: number;
  budgetEvidence: number;
  freshness: number;
  contactability: number;
  businessValue: number;
  total: number;
  classification:
    | "EXCEPTIONAL"
    | "HOT"
    | "STRONG"
    | "POTENTIAL"
    | "WEAK"
    | "LOW_PRIORITY";
}

function calculateIntent(
  intent: QualificationResult["buyingIntent"]
): number {
  switch (intent) {
    case "VERY_HIGH":
      return 30;
    case "HIGH":
      return 27;
    case "MEDIUM":
      return 18;
    case "LOW":
      return 7;
    default:
      return 0;
  }
}

function calculateServiceMatch(
  match: QualificationResult["serviceMatch"]
): number {
  switch (match) {
    case "EXACT":
      return 20;
    case "STRONG":
      return 17;
    case "POSSIBLE":
      return 10;
    case "WEAK":
      return 5;
    default:
      return 0;
  }
}

function calculateBudget(
  evidence: string
): number {
  const value = evidence.toLowerCase();

  if (
    value.includes("$") ||
    value.includes("budget") ||
    value.includes("quote") ||
    value.includes("pay")
  ) {
    return 12;
  }

  if (
    value.includes("not provided") ||
    value.includes("unclear")
  ) {
    return 0;
  }

  return 4;
}

function calculateContactability(
  value: QualificationResult["contactability"]
): number {
  switch (value) {
    case "DIRECT_CONTACT":
      return 10;
    case "PUBLIC_CONTACT":
      return 8;
    case "PLATFORM_ONLY":
      return 5;
    case "NO_CONTACT":
      return 1;
    default:
      return 0;
  }
}

export function calculateOpportunityScore(
  qualification: QualificationResult,
  freshnessScore: number
): OpportunityScoreBreakdown {
  const buyingIntent =
    calculateIntent(
      qualification.buyingIntent
    );

  const serviceMatch =
    calculateServiceMatch(
      qualification.serviceMatch
    );

  const budgetEvidence =
    calculateBudget(
      qualification.budgetEvidence
    );

  const freshness = Math.min(
    Math.max(freshnessScore, 0),
    15
  );

  const contactability =
    calculateContactability(
      qualification.contactability
    );

  const businessValue = Math.min(
    Math.max(
      Math.round(qualification.businessValue),
      0
    ),
    10
  );

  const total = Math.min(
    buyingIntent +
      serviceMatch +
      budgetEvidence +
      freshness +
      contactability +
      businessValue,
    100
  );

  let classification:
    | "EXCEPTIONAL"
    | "HOT"
    | "STRONG"
    | "POTENTIAL"
    | "WEAK"
    | "LOW_PRIORITY";

  if (total >= 90) {
    classification = "EXCEPTIONAL";
  } else if (total >= 80) {
    classification = "HOT";
  } else if (total >= 70) {
    classification = "STRONG";
  } else if (total >= 60) {
    classification = "POTENTIAL";
  } else if (total >= 40) {
    classification = "WEAK";
  } else {
    classification = "LOW_PRIORITY";
  }

  return {
    buyingIntent,
    serviceMatch,
    budgetEvidence,
    freshness,
    contactability,
    businessValue,
    total,
    classification,
  };
}