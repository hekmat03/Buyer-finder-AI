import type { RawCandidate } from "@/lib/types/domain";

export interface SourceSearchParams {
  /** Free-text service focus, e.g. "web development", "AI automation". */
  service?: string;
  /** Additional keywords to AND onto the buying-intent query. */
  keywords?: string[];
  /** Only return candidates newer than this (ISO 8601). */
  since?: string;
  /** Provider-specific location hint (best-effort; most sources ignore this). */
  location?: string;
  /** Max candidates to return for this call. */
  limit?: number;
}

export interface SourceHealth {
  ok: boolean;
  detail: string;
  checkedAt: string;
}

/**
 * Contract every data source (Reddit today; X/LinkedIn/Facebook/
 * freelance marketplaces later) must implement. Keeping search/fetch/
 * normalize/healthCheck separate lets the pipeline swap or add
 * sources without touching qualification or scoring code.
 */
export interface SourceProvider {
  /** Stable id stored in the `sources` table, e.g. "reddit". */
  readonly id: string;

  /** Run a buying-intent-focused query and return raw hits. */
  search(params: SourceSearchParams): Promise<RawCandidate[]>;

  /** Fetch full content for a single item if search() only returned a summary. */
  fetch(externalId: string): Promise<RawCandidate | null>;

  /** Cheap normalization specific to this source's payload shape. */
  normalize(raw: RawCandidate): RawCandidate;

  /** Used by /api/stats and the scheduler to skip a source that's down. */
  healthCheck(): Promise<SourceHealth>;
}
