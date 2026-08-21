export function clampScore(
  value: number,
  min = 0,
  max = 100
): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(
    Math.max(Math.round(value), min),
    max
  );
}

export function freshnessToScore(
  level: string
): number {
  switch (level) {
    case "FRESH":
      return 15;
    case "RECENT":
      return 11;
    case "STALE":
      return 3;
    default:
      return 0;
  }
}