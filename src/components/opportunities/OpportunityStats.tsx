"use client";

import type { OpportunityStats as Stats } from "@/lib/opportunities/stats";

interface OpportunityStatsProps {
  stats: Stats;
}

export function OpportunityStats({
  stats,
}: OpportunityStatsProps) {
  const cards = [
    {
      label: "Total",
      value: stats.total,
    },
    {
      label: "Hot",
      value: stats.hot,
    },
    {
      label: "Strong",
      value: stats.strong,
    },
    {
      label: "High Intent",
      value: stats.highIntent,
    },
    {
      label: "Average Score",
      value: stats.averageScore,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <p className="text-xs text-white/40">
            {card.label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}