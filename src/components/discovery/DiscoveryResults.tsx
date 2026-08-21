"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  OpportunityRecord,
} from "@/lib/opportunities/types";

import {
  OpportunityDashboard,
} from "@/components/opportunities/OpportunityDashboard";

interface DiscoveryResultsProps {
  refreshKey?: number;
}

export function DiscoveryResults({
  refreshKey,
}: DiscoveryResultsProps) {
  const [
    opportunities,
    setOpportunities,
  ] = useState<
    OpportunityRecord[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response =
          await fetch(
            "/api/opportunities?limit=50",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load opportunities."
          );
        }

        if (!cancelled) {
          setOpportunities(
            data.opportunities ?? []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load opportunities."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/50">
        Loading opportunities...
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

  return (
    <OpportunityDashboard
      opportunities={opportunities}
    />
  );
}