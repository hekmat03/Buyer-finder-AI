"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  OpportunityRecord,
} from "@/lib/opportunities/types";

import {
  calculateOpportunityStats,
} from "@/lib/opportunities/stats";

import {
  filterOpportunities,
} from "@/lib/opportunities/filters";

import {
  sortOpportunities,
  type OpportunitySortMode,
} from "@/lib/opportunities/sort";

import {
  OpportunityFilters,
  type OpportunityFilterState,
} from "./OpportunityFilters";

import {
  OpportunityToolbar,
} from "./OpportunityToolbar";

import {
  OpportunityList,
} from "./OpportunityList";

import {
  OpportunityStats,
} from "./OpportunityStats";

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
    useState<OpportunitySortMode>(
      "score"
    );

  const filtered =
    useMemo(() => {
      const result =
        filterOpportunities(
          opportunities,
          {
            service: filters.service,
            classification:
              filters.classification,
            minScore: filters.minScore,
          }
        );

      return sortOpportunities(
        result,
        sort
      );
    }, [
      opportunities,
      filters,
      sort,
    ]);

  const stats = useMemo(
    () =>
      calculateOpportunityStats(
        opportunities
      ),
    [opportunities]
  );

  return (
    <div className="space-y-6">
      <OpportunityStats
        stats={stats}
      />

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