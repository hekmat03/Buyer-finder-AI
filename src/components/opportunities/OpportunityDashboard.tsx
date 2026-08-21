"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  OpportunityRecord,
} from "@/lib/opportunities/types";

import {
  OpportunityFilters,
  type OpportunityFilterState,
} from "./OpportunityFilters";

import {
  OpportunityToolbar,
  type OpportunitySort,
} from "./OpportunityToolbar";

import {
  OpportunityList,
} from "./OpportunityList";

interface OpportunityDashboardProps {
  opportunities: OpportunityRecord[];
}

export function OpportunityDashboard({
  opportunities,
}: OpportunityDashboardProps) {
  const [filters, setFilters] =
    useState<OpportunityFilterState>({
      service: "ALL",
      classification: "ALL",
      minScore: 0,
    });

  const [sort, setSort] =
    useState<OpportunitySort>(
      "score"
    );

  const filtered =
    useMemo(() => {
      const result =
        opportunities.filter(
          (opportunity) => {
            const serviceMatch =
              filters.service ===
                "ALL" ||
              opportunity.requestedService ===
                filters.service;

            const classificationMatch =
              filters.classification ===
                "ALL" ||
              opportunity.classification ===
                filters.classification;

            const scoreMatch =
              opportunity.score >=
              filters.minScore;

            return (
              serviceMatch &&
              classificationMatch &&
              scoreMatch
            );
          }
        );

      return result.sort(
        (a, b) => {
          if (sort === "newest") {
            return (
              new Date(
                b.createdAt ?? 0
              ).getTime() -
              new Date(
                a.createdAt ?? 0
              ).getTime()
            );
          }

          if (sort === "oldest") {
            return (
              new Date(
                a.createdAt ?? 0
              ).getTime() -
              new Date(
                b.createdAt ?? 0
              ).getTime()
            );
          }

          return b.score - a.score;
        }
      );
    }, [
      opportunities,
      filters,
      sort,
    ]);

  return (
    <div className="space-y-5">
      <OpportunityFilters
        filters={filters}
        onChange={setFilters}
      />

      <OpportunityToolbar
        sort={sort}
        onSortChange={setSort}
        count={filtered.length}
      />

      <OpportunityList
        opportunities={filtered}
      />
    </div>
  );
}