import type {
  RawCandidate,
} from "@/lib/types/domain";

import type {
  SourceHealth,
  SourceProvider,
  SourceSearchParams,
} from "@/lib/providers/source-provider";

interface RedditListingChild {
  data?: {
    id?: string;
    name?: string;
    title?: string;
    selftext?: string;
    author?: string | null;
    permalink?: string;
    url?: string;
    created_utc?: number;
    subreddit?: string;
  };
}

interface RedditListingResponse {
  data?: {
    children?: RedditListingChild[];
  };
}

const REDDIT_API = "https://www.reddit.com";

const DEFAULT_QUERIES = [
  '"looking for a developer"',
  '"need a developer"',
  '"looking for web developer"',
  '"need a website"',
  '"need a chatbot"',
  '"AI automation"',
  '"AI agent"',
  '"looking for an agency"',
  '"looking for someone to build"',
];

function buildQuery(params: SourceSearchParams): string {
  const service = params.service?.trim();

  const keywords = params.keywords
    ?.map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 5);

  const terms = [
    ...(service ? [`"${service}"`] : []),
    ...(keywords ?? []),
  ];

  if (terms.length > 0) {
    return terms.join(" OR ");
  }

  return DEFAULT_QUERIES.join(" OR ");
}

function toRawCandidate(
  item: RedditListingChild["data"]
): RawCandidate | null {
  if (!item?.id || !item.permalink) {
    return null;
  }

  const createdAt =
    typeof item.created_utc === "number"
      ? new Date(item.created_utc * 1000).toISOString()
      : null;

  const url = item.permalink.startsWith("http")
    ? item.permalink
    : `${REDDIT_API}${item.permalink}`;

  return {
    sourceId: "reddit",
    externalId: item.id,
    url,
    title: item.title ?? null,
    text: item.selftext ?? "",
    author: item.author ?? null,
    createdAt,
    fetchedAt: new Date().toISOString(),
    raw: {
      id: item.id,
      name: item.name,
      subreddit: item.subreddit,
      title: item.title,
      selftext: item.selftext,
      author: item.author,
      permalink: item.permalink,
      created_utc: item.created_utc,
    },
  };
}

export const redditProvider: SourceProvider = {
  id: "reddit",

  async search(params): Promise<RawCandidate[]> {
    const query = encodeURIComponent(buildQuery(params));

    const limit = Math.min(
      Math.max(params.limit ?? 25, 1),
      100
    );

    const url =
      `${REDDIT_API}/search.json` +
      `?q=${query}` +
      `&sort=new` +
      `&type=link` +
      `&limit=${limit}` +
      `&raw_json=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "BuyerFinderAI/1.0 public-opportunity-discovery",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Reddit discovery failed with HTTP ${response.status}.`
      );
    }

    const data =
      (await response.json()) as RedditListingResponse;

    const children = data.data?.children ?? [];

    const candidates = children
      .map((child) => toRawCandidate(child.data))
      .filter(
        (candidate): candidate is RawCandidate =>
          candidate !== null
      );

    if (params.since) {
      const since = new Date(params.since);

      if (!Number.isNaN(since.getTime())) {
        return candidates.filter((candidate) => {
          if (!candidate.createdAt) return false;

          return (
            new Date(candidate.createdAt).getTime() >=
            since.getTime()
          );
        });
      }
    }

    return candidates;
  },

  async fetch(externalId): Promise<RawCandidate | null> {
    const url =
      `${REDDIT_API}/comments/${encodeURIComponent(externalId)}.json` +
      "?raw_json=1";

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "BuyerFinderAI/1.0 public-opportunity-discovery",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return null;
  },

  normalize(raw) {
    return {
      ...raw,
      sourceId: "reddit",
      title: raw.title?.trim() || null,
      text: raw.text.trim(),
      author: raw.author?.trim() || null,
      url: raw.url.trim(),
    };
  },

  async healthCheck(): Promise<SourceHealth> {
    const checkedAt = new Date().toISOString();

    try {
      const response = await fetch(
        `${REDDIT_API}/r/all/about.json`,
        {
          headers: {
            "User-Agent":
              "BuyerFinderAI/1.0 health-check",
          },
          cache: "no-store",
        }
      );

      return {
        ok: response.ok,
        detail: response.ok
          ? "Reddit public endpoint is reachable."
          : `Reddit returned HTTP ${response.status}.`,
        checkedAt,
      };
    } catch {
      return {
        ok: false,
        detail: "Reddit endpoint could not be reached.",
        checkedAt,
      };
    }
  },
};