import type {
  OpportunityRecord,
} from "@/lib/opportunities/types";

import {
  OpportunityCard,
} from "./OpportunityCard";

interface OpportunityListProps {
  opportunities: OpportunityRecord[];
}

export function OpportunityList({
  opportunities,
}: OpportunityListProps) {
  if (opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <h3 className="text-lg font-semibold text-white">
          No opportunities found
        </h3>

        <p className="mt-2 text-sm text-white/50">
          Run a discovery search to find
          potential buyers.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {opportunities.map(
        (opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={
              opportunity
            }
          />
        )
      )}
    </div>
  );
}