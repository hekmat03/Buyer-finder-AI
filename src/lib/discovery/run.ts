import {
  redditProvider,
} from "@/lib/providers/reddit";

import {
  discoverAndSave,
} from "./discover-and-save";

import type {
  SupportedService,
} from "./service-match";

export async function runRedditDiscovery(
  service: SupportedService,
  keywords?: string[],
  limit = 25
) {
  return discoverAndSave(
    redditProvider,
    {
      service,
      keywords,
      limit,
    }
  );
}