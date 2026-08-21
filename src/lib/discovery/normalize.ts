import { createHash } from "crypto";

import type {
  NormalizedCandidate,
  RawCandidate,
} from "@/lib/types/domain";

export function normalizeText(
  value: string
): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalizeUrl(
  value: string
): string {
  try {
    const url = new URL(value.trim());

    url.hash = "";

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

    if (url.pathname.length > 1) {
      url.pathname =
        url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
  } catch {
    return value.trim();
  }
}

export function createTextHash(
  value: string
): string {
  return createHash("sha256")
    .update(
      normalizeText(value),
      "utf8"
    )
    .digest("hex");
}

export function normalizeCandidate(
  candidate: RawCandidate
): NormalizedCandidate {
  const normalizedText =
    normalizeText(candidate.text);

  return {
    ...candidate,
    url: canonicalizeUrl(candidate.url),
    normalizedText,
    textHash:
      createTextHash(normalizedText),
  };
}

export function createSourceExternalKey(
  sourceId: string,
  externalId: string
): string {
  return `${sourceId
    .trim()
    .toLowerCase()}:${externalId.trim()}`;
}