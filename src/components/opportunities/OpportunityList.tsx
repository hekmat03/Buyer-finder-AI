"use client";

import { useState } from "react";

import type {
  OpportunityRecord,
} from "@/lib/opportunities/types";

import {
  OpportunityCard,
} from "./OpportunityCard";

import {
  OpportunityDetail,
} from "./OpportunityDetail";

interface OpportunityListProps {
  opportunities: OpportunityRecord[];
}

export function OpportunityList({
  opportunities,
}: OpportunityListProps) {
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  if (opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
        <p className="text-sm font-medium text-white">
          No opportunities found
        </p>

        <p className="mt-2 text-sm text-white/40">
          Try changing your filters or run another discovery search.
        </p>
      </div>
    );
  }

  if (selectedId) {
    return (
      <OpportunityDetail
        id={selectedId}
        onClose={() =>
          setSelectedId(null)
        }
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {opportunities.map(
        (opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onSelect={setSelectedId}
          />
        )
      )}
    </div>
  );
}