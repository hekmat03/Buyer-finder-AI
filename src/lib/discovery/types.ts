import type {
  FreshnessAssessment,
  NormalizedCandidate,
  RawCandidate,
} from "@/lib/types/domain";
import type {
  ServiceMatch,
  SupportedService,
} from "@/lib/discovery/service-match";

export interface DiscoveryRequest {
  service: SupportedService;
  keywords?: string[];
  location?: string;
  since?: string;
  limit?: number;
}

export interface DiscoveryResult {
  sourceId: string;
  candidate: NormalizedCandidate;
  freshness: FreshnessAssessment;
  serviceMatch: ServiceMatch;
  duplicate: boolean;
  duplicateOfId: string | null;
}

export interface DiscoverySourceResult {
  sourceId: string;
  rawCandidates: RawCandidate[];
  errors: string[];
}

export interface DiscoverySummary {
  discovered: number;
  normalized: number;
  fresh: number;
  duplicates: number;
  serviceMatches: number;
  errors: string[];
}