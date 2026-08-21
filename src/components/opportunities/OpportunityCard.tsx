import type {
  OpportunityRecord,
} from "@/lib/opportunities/types";

interface OpportunityCardProps {
  opportunity: OpportunityRecord;
}

export function OpportunityCard({
  opportunity,
}: OpportunityCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs uppercase tracking-wide text-white/40">
            {opportunity.sourceId}
          </p>

          <h3 className="line-clamp-2 text-lg font-semibold text-white">
            {opportunity.title ||
              "Untitled opportunity"}
          </h3>
        </div>

        <div className="shrink-0 rounded-xl border border-white/10 px-3 py-2 text-center">
          <div className="text-2xl font-bold text-white">
            {opportunity.score}
          </div>

          <div className="text-[10px] uppercase text-white/40">
            score
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/60">
        {opportunity.text}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>
          {opportunity.classification}
        </Badge>

        <Badge>
          {opportunity.buyingIntent}
        </Badge>

        <Badge>
          {opportunity.serviceMatch}
        </Badge>

        <Badge>
          {opportunity.contactability}
        </Badge>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-white/40">
          {opportunity.requestedService}
        </span>

        <a
          href={opportunity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
        >
          View source
        </a>
      </div>
    </article>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70">
      {children}
    </span>
  );
}