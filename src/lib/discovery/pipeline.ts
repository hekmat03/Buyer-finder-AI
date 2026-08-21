import type {
  SourceProvider,
  SourceSearchParams,
} from "@/lib/providers/source-provider";

import type {
  NormalizedCandidate,
} from "@/lib/types/domain";

import {
  normalizeCandidate,
} from "./normalize";

import {
  assessFreshness,
} from "./freshness";

import {
  findDuplicate,
} from "./dedupe";

import {
  matchService,
  type SupportedService,
} from "./service-match";

import {
  assessBuyingIntent,
} from "./buying-intent";

import type {
  DiscoveryRequest,
  DiscoveryResult,
  DiscoverySummary,
} from "./types";

export interface ExistingOpportunity {
  id: string;
  sourceId: string;
  externalId: string;
  url: string;
  textHash: string;
}

export interface DiscoveryPipelineResult {
  results: DiscoveryResult[];
  summary: DiscoverySummary;
}

export async function runDiscoveryPipeline(
  provider: SourceProvider,
  request: DiscoveryRequest,
  existing: ExistingOpportunity[] = []
): Promise<DiscoveryPipelineResult> {
  const params: SourceSearchParams = {
    service: request.service,
    keywords: request.keywords,
    location: request.location,
    since: request.since,
    limit: Math.min(
      Math.max(request.limit ?? 25, 1),
      100
    ),
  };

  const summary: DiscoverySummary = {
    discovered: 0,
    normalized: 0,
    fresh: 0,
    duplicates: 0,
    serviceMatches: 0,
    errors: [],
  };

  let rawCandidates;

  try {
    rawCandidates =
      await provider.search(params);
  } catch (error) {
    summary.errors.push(
      error instanceof Error
        ? error.message
        : "Discovery provider failed."
    );

    return {
      results: [],
      summary,
    };
  }

  summary.discovered = rawCandidates.length;

  const results: DiscoveryResult[] = [];

  for (const rawCandidate of rawCandidates) {
    try {
      const sourceNormalized =
        provider.normalize(rawCandidate);

      const candidate =
        normalizeCandidate(sourceNormalized);

      summary.normalized++;

      const freshness =
        assessFreshness(candidate.createdAt);

      if (
        freshness.level === "FRESH" ||
        freshness.level === "RECENT"
      ) {
        summary.fresh++;
      }

      const duplicate =
        findDuplicate(candidate, existing);

      if (duplicate.duplicate) {
        summary.duplicates++;
      }

      const combinedText = [
        candidate.title ?? "",
        candidate.text,
      ].join("\n");

      const serviceMatch =
        matchService(
          combinedText,
          request.service as SupportedService
        );

      if (serviceMatch.level !== "NONE") {
        summary.serviceMatches++;
      }

      // Buying intent is calculated here so the pipeline
      // already has deterministic intent information before
      // any future AI qualification step.
      assessBuyingIntent(combinedText);

      results.push({
        sourceId: candidate.sourceId,
        candidate,
        freshness,
        serviceMatch,
        duplicate: duplicate.duplicate,
        duplicateOfId: duplicate.duplicateOfId,
      });
    } catch (error) {
      summary.errors.push(
        error instanceof Error
          ? error.message
          : "Failed to process a discovered candidate."
      );
    }
  }

  return {
    results,
    summary,
  };
}