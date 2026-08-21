"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  StatsCards,
} from "./StatsCards";

interface Stats {
  total: number;
  highPriority: number;
  averageScore: number;
  veryHighIntent: number;
}

export function DashboardStats() {
  const [stats, setStats] =
    useState<Stats>({
      total: 0,
      highPriority: 0,
      averageScore: 0,
      veryHighIntent: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response =
          await fetch(
            "/api/opportunities/stats",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data?.stats
        ) {
          setStats(data.stats);
        }
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/40">
        Loading statistics...
      </div>
    );
  }

  return (
    <StatsCards stats={stats} />
  );
}