import { createHash } from "crypto";
import type {
  NormalizedCandidate,
  RawCandidate,
} from "@/lib/types/domain";

/**
 * Normalizes text for deterministic duplicate detection.
 *
 * This does NOT modify the original candidate text.
 * It creates a normalized representation used only for hashing/search.
 */
export function normalizeText(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Canonicalizes URLs so small formatting differences do not create
 * duplicate opportunities.
 */
export function canonicalizeUrl(value: string): string {
  try {
    const url = new URL(value.trim());

    url.hash = "";

    // Remove common tracking parameters.
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "ref",
    ];

    for (const param of trackingParams) {
      url.searchParams.delete(param);
    }

    // Normalize trailing slash except for the root path.
    if (url.pathname.length > 1) {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
  } catch {
    // Never invent or repair an invalid URL.
    return value.trim();
  }
}

/**
 * Creates a stable SHA-256 hash from normalized content.
 */
export function createTextHash(value: string): string {
  return createHash("sha256")
    .update(normalizeText(value), "utf8")
    .digest("hex");
}

/**
 * Creates a normalized candidate while preserving the original
 * source payload.
 */
export function normalizeCandidate(
  candidate: RawCandidate
): NormalizedCandidate {
  const normalizedText = normalizeText(candidate.text);

  return {
    ...candidate,
    url: canonicalizeUrl(candidate.url),
    normalizedText,
    textHash: createTextHash(normalizedText),
  };
}

/**
 * Creates a deterministic key useful for checking whether the same
 * source item has already been processed.
 */
export function createSourceExternalKey(
  sourceId: string,
  externalId: string
): string {
  return `${sourceId.trim().toLowerCase()}:${externalId.trim()}`;
}