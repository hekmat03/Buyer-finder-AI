import type {
  SourceProvider,
} from "@/lib/providers/source-provider";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  runDiscoveryPipeline,
} from "./pipeline";

import {
  savePreparedOpportunity,
} from "./save-prepared-opportunity";

import type {
  DiscoveryRequest,
} from "./types";

import type {
  SupportedService,
} from "./service-match";

export interface DiscoverAndSaveResult {
  discovered: number;
  saved: number;
  skipped: number;
  errors: string[];
  opportunities: unknown[];
}

export async function discoverAndSave(
  provider: SourceProvider,
  request: DiscoveryRequest
): Promise<DiscoverAndSaveResult> {
  const supabase =
    createSupabaseServerClient();

  const { data, error } =
    await supabase
      .from("opportunities")
      .select(
        "id, source_id, external_id, url, text_hash"
      );

  if (error) {
    throw new Error(
      `Failed to load existing opportunities: ${error.message}`
    );
  }

  const existing = (data ?? []).map(
    (row) => ({
      id: String(row.id),
      sourceId: String(
        row.source_id
      ),
      externalId: String(
        row.external_id
      ),
      url: String(row.url ?? ""),
      textHash: String(
        row.text_hash ?? ""
      ),
    })
  );

  const pipeline =
    await runDiscoveryPipeline(
      provider,
      request,
      existing
    );

  const result: DiscoverAndSaveResult = {
    discovered:
      pipeline.summary.discovered,

    saved: 0,
    skipped: 0,

    errors: [
      ...pipeline.summary.errors,
    ],

    opportunities: [],
  };

  for (const item of pipeline.results) {
    try {
      if (item.duplicate) {
        result.skipped++;
        continue;
      }

      const saved =
        await savePreparedOpportunity(
          item.candidate,
          request.service as SupportedService,
          false,
          null
        );

      result.saved++;

      result.opportunities.push(
        saved
      );
    } catch (error) {
      result.errors.push(
        error instanceof Error
          ? error.message
          : "Failed to save opportunity."
      );
    }
  }

  return result;
}