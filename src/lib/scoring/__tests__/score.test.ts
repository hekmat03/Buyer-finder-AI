import { describe, expect, it } from "vitest";
import { scoreOpportunity, type ScoringInput } from "@/lib/scoring/score";

// Spec §26 example: "I own a small roofing company and need someone to
// build a new website. Budget $500. Need it this month."
// Expected: Clean Buyer, Web Development, Budget=$500, High/Very High
// intent, Score >= 55.
const roofingCompanyInput: ScoringInput = {
  buyerClassification: "CLEAN",
  buyerIntent: "HIGH",
  serviceIsDirectMatch: true,
  serviceIsRelated: false,
  hasExplicitBudget: true,
  hasClearCommercialProject: true,
  freshness: "FRESH",
  daysOld: 2,
  hasImmediateUrgency: true,
  hasPublicEmailPhoneOrWhatsapp: false,
  hasIdentifiablePublicProfile: true,
  isDifficultButPossibleToContact: false,
  isStrongCommercialBuyer: false,
  isLegitimateSmallerBusiness: true,
};

const noisyHobbyistInput: ScoringInput = {
  buyerClassification: "NOISY",
  buyerIntent: "MEDIUM",
  serviceIsDirectMatch: true,
  serviceIsRelated: false,
  hasExplicitBudget: false,
  hasClearCommercialProject: false,
  freshness: "RECENT",
  daysOld: 5,
  hasImmediateUrgency: false,
  hasPublicEmailPhoneOrWhatsapp: false,
  hasIdentifiablePublicProfile: true,
  isDifficultButPossibleToContact: false,
  isStrongCommercialBuyer: false,
  isLegitimateSmallerBusiness: false,
};

const staleWeakSignalInput: ScoringInput = {
  buyerClassification: "UNCLEAR",
  buyerIntent: "LOW",
  serviceIsDirectMatch: false,
  serviceIsRelated: true,
  hasExplicitBudget: false,
  hasClearCommercialProject: false,
  freshness: "STALE",
  daysOld: 140,
  hasImmediateUrgency: false,
  hasPublicEmailPhoneOrWhatsapp: false,
  hasIdentifiablePublicProfile: false,
  isDifficultButPossibleToContact: false,
  isStrongCommercialBuyer: false,
  isLegitimateSmallerBusiness: false,
};

describe("scoreOpportunity", () => {
  it("scores the spec's roofing-company example >= 55 (MEDIUM or above)", () => {
    const result = scoreOpportunity(roofingCompanyInput);
    expect(result.total).toBeGreaterThanOrEqual(55);
    expect(["HOT", "HIGH", "MEDIUM"]).toContain(result.label);
  });

  it("hard-caps NOISY buyers at 45 regardless of other signals", () => {
    const result = scoreOpportunity(noisyHobbyistInput);
    expect(result.total).toBeLessThanOrEqual(45);
  });

  it("rejects content older than 90 days with no urgency override", () => {
    const result = scoreOpportunity(staleWeakSignalInput);
    expect(result.total).toBeLessThanOrEqual(29);
    expect(result.label).toBe("REJECT");
  });

  it("always returns a total within 0-100", () => {
    for (const input of [roofingCompanyInput, noisyHobbyistInput, staleWeakSignalInput]) {
      const result = scoreOpportunity(input);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
    }
  });
});
