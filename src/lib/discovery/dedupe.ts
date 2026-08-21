import type { NormalizedCandidate } from "@/lib/types/domain";

export interface DuplicateMatch {
  duplicate: boolean;
  duplicateOfId: string | null;
  reason:
    | "SOURCE_EXTERNAL_ID"
    | "SOURCE_URL"
    | "TEXT_HASH"
    | "NONE";
}

/**
 * Finds whether a candidate already exists.
 *
 * Checks are intentionally deterministic:
 * 1. Same source + external ID
 * 2. Same canonical source URL
 * 3. Same normalized text hash
 */
export function findDuplicate(
  candidate: NormalizedCandidate,
  existing: Array<{
    id: string;
    sourceId: string;
    externalId: string;
    url: string;
    textHash: string;
  }>
): DuplicateMatch {
  const sourceMatch = existing.find(
    (item) =>
      item.sourceId === candidate.sourceId &&
      item.externalId === candidate.externalId
  );

  if (sourceMatch) {
    return {
      duplicate: true,
      duplicateOfId: sourceMatch.id,
      reason: "SOURCE_EXTERNAL_ID",
    };
  }

  const urlMatch = existing.find(
    (item) =>
      item.url &&
      candidate.url &&
      item.url === candidate.url
  );

  if (urlMatch) {
    return {
      duplicate: true,
      duplicateOfId: urlMatch.id,
      reason: "SOURCE_URL",
    };
  }

  const hashMatch = existing.find(
    (item) =>
      item.textHash &&
      candidate.textHash &&
      item.textHash === candidate.textHash
  );

  if (hashMatch) {
    return {
      duplicate: true,
      duplicateOfId: hashMatch.id,
      reason: "TEXT_HASH",
    };
  }

  return {
    duplicate: false,
    duplicateOfId: null,
    reason: "NONE",
  };
}