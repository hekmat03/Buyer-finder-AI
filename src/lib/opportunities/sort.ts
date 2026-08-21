import type { OpportunityRecord } from "./types";

export type OpportunitySortMode =
  | "score"
  | "newest"
  | "oldest";

export function sortOpportunities(
  opportunities: OpportunityRecord[],
  mode: OpportunitySortMode = "score"
): OpportunityRecord[] {
  return [...opportunities].sort((a, b) => {
    if (mode === "newest") {
      return getTime(b.createdAt) - getTime(a.createdAt);
    }

    if (mode === "oldest") {
      return getTime(a.createdAt) - getTime(b.createdAt);
    }

    return b.score - a.score;
  });
}

function getTime(
  value: string | null | undefined
): number {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}