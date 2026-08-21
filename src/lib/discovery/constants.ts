export const DISCOVERY_LIMITS = {
  MIN: 1,
  DEFAULT: 25,
  MAX: 50,
} as const;

export const OPPORTUNITY_SCORE = {
  MIN: 0,
  MAX: 100,

  EXCEPTIONAL: 90,
  HOT: 80,
  STRONG: 70,
  POTENTIAL: 60,
  WEAK: 40,
} as const;

export const FRESHNESS_SCORE = {
  FRESH: 15,
  RECENT: 11,
  STALE: 3,
  UNCLEAR: 0,
} as const;