interface DiscoveryStatsProps {
  discovered: number;
  fresh: number;
  duplicates: number;
  matches: number;
}

export function DiscoveryStats({
  discovered,
  fresh,
  duplicates,
  matches,
}: DiscoveryStatsProps) {
  const stats = [
    ["Discovered", discovered],
    ["Fresh", fresh],
    ["Duplicates", duplicates],
    ["Matches", matches],
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <p className="text-xs text-white/40">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}