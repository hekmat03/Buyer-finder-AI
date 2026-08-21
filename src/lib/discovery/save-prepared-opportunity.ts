import type {
  NormalizedCandidate,
} from "@/lib/types/domain";

import {
  saveOpportunity,
} from "@/lib/opportunities/repository";

import {
  prepareOpportunity,
} from "./prepare-opportunity";

import type {
  SupportedService,
} from "./service-match";

export async function savePreparedOpportunity(
  candidate: NormalizedCandidate,
  service: SupportedService,
  duplicate = false,
  duplicateOfId: string | null = null
) {
  const prepared =
    await prepareOpportunity(
      candidate,
      service
    );

  return saveOpportunity({
    sourceId:
      candidate.sourceId,

    externalId:
      candidate.externalId,

    url:
      candidate.url,

    title:
      candidate.title,

    text:
      candidate.text,

    author:
      candidate.author,

    createdAt:
      candidate.createdAt,

    fetchedAt:
      candidate.fetchedAt,

    requestedService:
      service,

    buyingIntent:
      prepared.qualification
        .buyingIntent.level,

    serviceMatch:
      prepared.qualification
        .serviceMatch.level,

    score:
      prepared.score.total,

    classification:
      prepared.score.classification,

    contactability:
      prepared.contactability.level,

    verificationStatus:
      prepared.verification.status,

    duplicate,

    duplicateOfId,
  });
}