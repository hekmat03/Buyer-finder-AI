import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import type {
  OpportunityRecord,
  SaveOpportunityInput,
} from "./types";

import {
  createTextHash,
} from "@/lib/discovery/normalize";

const TABLE_NAME = "opportunities";

export async function saveOpportunity(
  input: SaveOpportunityInput
): Promise<OpportunityRecord> {
  const supabase =
    createSupabaseServerClient();

  const payload = {
    source_id: input.sourceId,
    external_id: input.externalId,

    url: input.url,
    title: input.title,
    text: input.text,
    text_hash: createTextHash(input.text),
    author: input.author,

    source_created_at:
      input.createdAt,

    fetched_at:
      input.fetchedAt,

    requested_service:
      input.requestedService,

    buying_intent:
      input.buyingIntent,

    service_match:
      input.serviceMatch,

    score: input.score,

    classification:
      input.classification,

    contactability:
      input.contactability,

    verification_status:
      input.verificationStatus,

    duplicate:
      input.duplicate,

    duplicate_of_id:
      input.duplicateOfId,

    updated_at:
      new Date().toISOString(),
  };

  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .upsert(payload, {
        onConflict:
          "source_id,external_id",
      })
      .select("*")
      .single();

  if (error) {
    throw new Error(
      `Failed to save opportunity: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "Supabase returned no opportunity."
    );
  }

  return mapOpportunity(data);
}

export async function getOpportunityById(
  id: string
): Promise<OpportunityRecord | null> {
  const supabase =
    createSupabaseServerClient();

  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to fetch opportunity: ${error.message}`
    );
  }

  return data
    ? mapOpportunity(data)
    : null;
}

export async function listOpportunities(
  limit = 50
): Promise<OpportunityRecord[]> {
  const supabase =
    createSupabaseServerClient();

  const safeLimit = Math.min(
    Math.max(Math.floor(limit), 1),
    100
  );

  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("score", {
        ascending: false,
      })
      .limit(safeLimit);

  if (error) {
    throw new Error(
      `Failed to list opportunities: ${error.message}`
    );
  }

  return (data ?? []).map(
    mapOpportunity
  );
}

function mapOpportunity(
  row: Record<string, unknown>
): OpportunityRecord {
  return {
    id: String(row.id),

    sourceId: String(
      row.source_id
    ),

    externalId: String(
      row.external_id
    ),

    url: String(
      row.url ?? ""
    ),

    title:
      typeof row.title ===
      "string"
        ? row.title
        : null,

    text: String(
      row.text ?? ""
    ),

    author:
      typeof row.author ===
      "string"
        ? row.author
        : null,

    createdAt:
      typeof row.source_created_at ===
      "string"
        ? row.source_created_at
        : null,

    fetchedAt: String(
      row.fetched_at ?? ""
    ),

    requestedService:
      String(
        row.requested_service ?? ""
      ),

    buyingIntent:
      String(
        row.buying_intent ?? ""
      ),

    serviceMatch:
      String(
        row.service_match ?? ""
      ),

    score: Number(
      row.score ?? 0
    ),

    classification:
      String(
        row.classification ?? ""
      ),

    contactability:
      row.contactability as OpportunityRecord[
        "contactability"
      ],

    verificationStatus:
      row.verification_status as OpportunityRecord[
        "verificationStatus"
      ],

    duplicate:
      Boolean(row.duplicate),

    duplicateOfId:
      typeof row.duplicate_of_id ===
      "string"
        ? row.duplicate_of_id
        : null,

    createdAtDb:
      String(
        row.created_at ?? ""
      ),

    updatedAtDb:
      String(
        row.updated_at ?? ""
      ),
  };
}