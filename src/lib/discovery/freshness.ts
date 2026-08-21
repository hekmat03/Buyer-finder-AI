import type {
  FreshnessAssessment,
  FreshnessLevel,
} from "@/lib/types/domain";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface FreshnessOptions {
  now?: Date;
  recentDays?: number;
  staleDays?: number;
}

/**
 * Determines how fresh a public opportunity is.
 *
 * Rules:
 * 0–7 days   = FRESH
 * 8–30 days  = RECENT
 * 31+ days   = STALE
 *
 * Missing or invalid dates are never guessed.
 */
export function assessFreshness(
  createdAt: string | null,
  options: FreshnessOptions = {}
): FreshnessAssessment {
  const now = options.now ?? new Date();
  const recentDays = options.recentDays ?? 7;
  const staleDays = options.staleDays ?? 30;

  if (!createdAt) {
    return {
      level: "UNCLEAR",
      daysOld: null,
      reason: "Publication date was not provided by the source.",
    };
  }

  const created = new Date(createdAt);

  if (Number.isNaN(created.getTime())) {
    return {
      level: "UNCLEAR",
      daysOld: null,
      reason: "Publication date provided by the source was invalid.",
    };
  }

  const ageMs = Math.max(0, now.getTime() - created.getTime());
  const daysOld = Math.floor(ageMs / DAY_MS);

  let level: FreshnessLevel;

  if (daysOld <= recentDays) {
    level = "FRESH";
  } else if (daysOld <= staleDays) {
    level = "RECENT";
  } else {
    level = "STALE";
  }

  return {
    level,
    daysOld,
    reason: `${daysOld} day${daysOld === 1 ? "" : "s"} old based on the source publication date.`,
  };
}