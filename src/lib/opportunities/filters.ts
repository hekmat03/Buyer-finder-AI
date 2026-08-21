import type {
  OpportunityRecord,
} from "./types";

export interface OpportunityFilters {
  minScore?: number;

  classifications?: string[];

  services?: string[];

  buyingIntents?: string[];

  contactability?: string;

  source?: string;

  search?: string;
}

export function filterOpportunities(
  opportunities: OpportunityRecord[],
  filters: OpportunityFilters
): OpportunityRecord[] {
  const search =
    filters.search
      ?.trim()
      .toLowerCase();

  return opportunities.filter(
    (opportunity) => {
      if (
        typeof filters.minScore ===
          "number" &&
        opportunity.score <
          filters.minScore
      ) {
        return false;
      }

      if (
        filters.classifications
          ?.length &&
        !filters.classifications.includes(
          opportunity.classification
        )
      ) {
        return false;
      }

      if (
        filters.services?.length &&
        !filters.services.includes(
          opportunity.requestedService
        )
      ) {
        return false;
      }

      if (
        filters.buyingIntents?.length &&
        !filters.buyingIntents.includes(
          opportunity.buyingIntent
        )
      ) {
        return false;
      }

      if (
        filters.contactability &&
        opportunity.contactability !==
          filters.contactability
      ) {
        return false;
      }

      if (
        filters.source &&
        opportunity.sourceId !==
          filters.source
      ) {
        return false;
      }

      if (search) {
        const searchable = [
          opportunity.title ?? "",
          opportunity.text,
          opportunity.author ?? "",
          opportunity.requestedService,
          opportunity.classification,
        ]
          .join(" ")
          .toLowerCase();

        if (
          !searchable.includes(search)
        ) {
          return false;
        }
      }

      return true;
    }
  );
}