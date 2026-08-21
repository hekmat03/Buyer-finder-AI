import type { NormalizedCandidate } from "@/lib/types/domain";

import type {
  VerificationResult,
} from "./types";

export async function verifyOpportunity(
  candidate: NormalizedCandidate
): Promise<VerificationResult> {
  const warnings: string[] = [];

  let urlReachable = false;

  try {
    const response = await fetch(candidate.url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    urlReachable = response.ok;

    if (!response.ok) {
      warnings.push(
        `Source URL returned HTTP ${response.status}.`
      );
    }
  } catch {
    warnings.push(
      "Source URL could not be reached."
    );
  }

  const sourceAvailable =
    Boolean(candidate.sourceId);

  const dateValid =
    Boolean(
      candidate.createdAt &&
        !Number.isNaN(
          new Date(candidate.createdAt).getTime()
        )
    );

  if (!sourceAvailable) {
    warnings.push(
      "Source identifier is missing."
    );
  }

  if (!dateValid) {
    warnings.push(
      "Publication date could not be verified."
    );
  }

  let status: VerificationResult["status"];

  if (
    urlReachable &&
    sourceAvailable &&
    dateValid
  ) {
    status = "VERIFIED";
  } else if (
    sourceAvailable &&
    (urlReachable || dateValid)
  ) {
    status = "PARTIALLY_VERIFIED";
  } else if (sourceAvailable) {
    status = "UNVERIFIED";
  } else {
    status = "INVALID";
  }

  const confidence =
    status === "VERIFIED"
      ? 100
      : status === "PARTIALLY_VERIFIED"
        ? 70
        : status === "UNVERIFIED"
          ? 35
          : 0;

  return {
    status,
    urlReachable,
    sourceAvailable,
    dateValid,
    confidence,
    warnings,
    checkedAt: new Date().toISOString(),
  };
}