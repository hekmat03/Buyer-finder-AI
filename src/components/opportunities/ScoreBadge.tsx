interface ScoreBadgeProps {
  score: number;
  classification?: string;
}

export function ScoreBadge({
  score,
  classification,
}: ScoreBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm font-bold text-white">
        {score}/100
      </div>

      {classification && (
        <span className="text-xs font-medium text-white/50">
          {classification.replaceAll("_", " ")}
        </span>
      )}
    </div>
  );
}