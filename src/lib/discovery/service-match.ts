export type SupportedService =
  | "Web Development"
  | "AI Agent"
  | "AI Chatbot"
  | "AI Automation"
  | "SaaS Development"
  | "Custom Software";

export type ServiceMatchLevel =
  | "EXACT"
  | "STRONG"
  | "POSSIBLE"
  | "WEAK"
  | "NONE";

export interface ServiceMatch {
  service: SupportedService;
  level: ServiceMatchLevel;
  score: number;
  matchedTerms: string[];
}

const SERVICE_TERMS: Record<SupportedService, string[]> = {
  "Web Development": [
    "website",
    "web site",
    "web development",
    "web developer",
    "web designer",
    "website developer",
    "website redesign",
    "landing page",
    "wordpress",
    "frontend",
    "backend",
  ],

  "AI Agent": [
    "ai agent",
    "ai agents",
    "agentic ai",
    "autonomous agent",
    "ai employee",
    "ai assistant",
  ],

  "AI Chatbot": [
    "ai chatbot",
    "chatbot",
    "customer support bot",
    "support bot",
    "website chatbot",
    "conversational ai",
  ],

  "AI Automation": [
    "ai automation",
    "automation",
    "automate",
    "workflow automation",
    "business automation",
    "process automation",
    "zapier",
    "make.com",
    "n8n",
  ],

  "SaaS Development": [
    "saas",
    "saas platform",
    "software as a service",
    "web app",
    "startup mvp",
    "mvp",
  ],

  "Custom Software": [
    "custom software",
    "custom application",
    "custom app",
    "software development",
    "software developer",
    "internal tool",
    "business software",
  ],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}

function containsTerm(text: string, term: string): boolean {
  const normalizedText = normalize(text);
  const normalizedTerm = normalize(term);

  return normalizedText.includes(normalizedTerm);
}

/**
 * Determines how strongly an opportunity matches a requested service.
 *
 * This is deterministic and does not use AI.
 * AI can later add contextual reasoning on top of this result.
 */
export function matchService(
  text: string,
  requestedService: SupportedService
): ServiceMatch {
  const terms = SERVICE_TERMS[requestedService];
  const matchedTerms = terms.filter((term) => containsTerm(text, term));

  if (matchedTerms.length === 0) {
    return {
      service: requestedService,
      level: "NONE",
      score: 0,
      matchedTerms: [],
    };
  }

  if (matchedTerms.length >= 3) {
    return {
      service: requestedService,
      level: "EXACT",
      score: 20,
      matchedTerms,
    };
  }

  if (matchedTerms.length === 2) {
    return {
      service: requestedService,
      level: "STRONG",
      score: 17,
      matchedTerms,
    };
  }

  return {
    service: requestedService,
    level: "POSSIBLE",
    score: 10,
    matchedTerms,
  };
}

/**
 * Checks all supported services and returns them ordered by match strength.
 */
export function matchAllServices(text: string): ServiceMatch[] {
  return (Object.keys(SERVICE_TERMS) as SupportedService[])
    .map((service) => matchService(text, service))
    .sort((a, b) => b.score - a.score);
}