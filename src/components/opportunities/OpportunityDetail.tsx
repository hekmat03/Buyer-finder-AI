"use client";

import { useEffect, useState } from "react";

import type {
  OpportunityRecord,
} from "@/lib/opportunities/types";

interface OpportunityDetailProps {
  id: string;
  onClose?: () => void;
}

export function OpportunityDetail({
  id,
  onClose,
}: OpportunityDetailProps) {
  const [opportunity, setOpportunity] =
    useState<OpportunityRecord | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          `/api/opportunities/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load opportunity."
          );
        }

        setOpportunity(data.opportunity);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load opportunity."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/50">
        Loading opportunity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!opportunity) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">
            {opportunity.sourceId}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {opportunity.title ||
              "Untitled opportunity"}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold">
            {opportunity.score}
          </div>

          <div className="text-xs text-white/40">
            Score
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Info
          label="Classification"
          value={opportunity.classification}
        />

        <Info
          label="Buying Intent"
          value={opportunity.buyingIntent}
        />

        <Info
          label="Service Match"
          value={opportunity.serviceMatch}
        />

        <Info
          label="Contactability"
          value={opportunity.contactability}
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-white">
          Opportunity
        </p>

        <div className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
          {opportunity.text}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href={opportunity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
        >
          Open Source
        </a>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-white/40">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-white">
        {value}
      </p>
    </div>
  );
}