"use client";

import type { OpportunityRecord } from "@/lib/opportunities/types";

import { ScoreBadge } from "./ScoreBadge";

interface OpportunityCardProps {
  opportunity: OpportunityRecord;
  onSelect?: (id: string) => void;
}

export function OpportunityCard({
  opportunity,
  onSelect,
}: OpportunityCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-white/40">
            {opportunity.sourceId}
          </p>

          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
            {opportunity.title ||
              "Untitled opportunity"}
          </h3>
        </div>

        <ScoreBadge
          score={opportunity.score}
          classification={
            opportunity.classification
          }
        />
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/60">
        {opportunity.text}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Tag
          label={opportunity.buyingIntent}
        />

        <Tag
          label={opportunity.serviceMatch}
        />

        <Tag
          label={opportunity.contactability}
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <a
          href={opportunity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          View Source
        </a>

        {onSelect && (
          <button
            type="button"
            onClick={() =>
              onSelect(opportunity.id)
            }
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white"
          >
            Details
          </button>
        )}
      </div>
    </article>
  );
}

function Tag({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/50">
      {label.replaceAll("_", " ")}
    </span>
  );
}