interface Stats {
  total: number;
  highPriority: number;
  averageScore: number;
  veryHighIntent: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({
  stats,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Total Opportunities",
      value: stats.total,
    },
    {
      label: "High Priority",
      value: stats.highPriority,
    },
    {
      label: "Average Score",
      value: stats.averageScore,
    },
    {
      label: "Very High Intent",
      value: stats.veryHighIntent,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <p className="text-sm text-white/40">
            {card.label}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}