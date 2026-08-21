interface DashboardHeaderProps {
  onRefresh?: () => void;
}

export function DashboardHeader({
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          BUYERFINDER AI
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Buyer Discovery
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Discover public buying opportunities,
          qualify them, and focus on the strongest
          prospects.
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
        >
          Refresh
        </button>
      )}
    </div>
  );
}