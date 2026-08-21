import type { OpportunityRecord } from "./types";

export interface OpportunityFilterOptions {
  minScore?: number;
  classification?: string;
  buyingIntent?: string;
  service?: string;
}

export function filterOpportunities(
  opportunities: OpportunityRecord[],
  options: OpportunityFilterOptions = {}
): OpportunityRecord[] {
  return opportunities.filter((item) => {
    if (
      typeof options.minScore === "number" &&
      item.score < options.minScore
    ) {
      return false;
    }

    if (
      options.classification &&
      options.classification !== "ALL" &&
      item.classification !== options.classification
    ) {
      return false;
    }

    if (
      options.buyingIntent &&
      options.buyingIntent !== "ALL" &&
      item.buyingIntent !== options.buyingIntent
    ) {
      return false;
    }

    if (
      options.service &&
      options.service !== "ALL" &&
      item.requestedService !== options.service
    ) {
      return false;
    }

    return true;
  });
}