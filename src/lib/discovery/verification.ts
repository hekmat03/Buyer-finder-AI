import type {
  NormalizedCandidate,
} from "@/lib/types/domain";

export type VerificationStatus =
  | "VERIFIED"
  | "UNVERIFIED"
  | "FAILED";

export interface VerificationResult {
  status: VerificationStatus;
  reachable: boolean;
  reason: string;
}

export async function verifyCandidate(
  candidate: NormalizedCandidate
): Promise<VerificationResult> {
  if (!candidate.url) {
    return {
      status: "UNVERIFIED",
      reachable: false,
      reason: "No source URL was provided.",
    };
  }

  try {
    const response = await fetch(
      candidate.url,
      {
        method: "HEAD",
        redirect: "follow",
        cache: "no-store",
      }
    );

    if (response.ok) {
      return {
        status: "VERIFIED",
        reachable: true,
        reason:
          "Source URL is reachable.",
      };
    }

    return {
      status: "FAILED",
      reachable: false,
      reason:
        `Source returned HTTP ${response.status}.`,
    };
  } catch {
    return {
      status: "FAILED",
      reachable: false,
      reason:
        "Source URL could not be reached.",
    };
  }
}