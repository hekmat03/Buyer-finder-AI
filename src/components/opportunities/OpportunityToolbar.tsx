"use client";

export type OpportunitySort =
  | "score"
  | "newest"
  | "oldest";

interface OpportunityToolbarProps {
  sort: OpportunitySort;
  onSortChange: (
    sort: OpportunitySort
  ) => void;
  count: number;
}

export function OpportunityToolbar({
  sort,
  onSortChange,
  count,
}: OpportunityToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <p className="text-sm text-white/40">
        {count} opportunit
        {count === 1 ? "y" : "ies"}
      </p>

      <select
        value={sort}
        onChange={(event) =>
          onSortChange(
            event.target.value as OpportunitySort
          )
        }
        className="rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
      >
        <option value="score">
          Highest Score
        </option>
        <option value="newest">
          Newest
        </option>
        <option value="oldest">
          Oldest
        </option>
      </select>
    </div>
  );
}