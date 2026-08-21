import type {
  BuyerIntent,
} from "@/lib/types/domain";

export interface BuyingIntentAssessment {
  intent: BuyerIntent;
  score: number;
  signals: string[];
}

/**
 * Strong signals indicate that someone is actively looking
 * for a solution/provider rather than simply discussing a topic.
 */
const VERY_HIGH_SIGNALS = [
  "hire a developer",
  "hiring a developer",
  "looking to hire",
  "need a developer",
  "looking for a developer",
  "looking for someone to build",
  "need someone to build",
  "request for proposal",
  "rfp",
  "need an agency",
  "looking for an agency",
];

const HIGH_SIGNALS = [
  "need a website",
  "need a web developer",
  "looking for web developer",
  "need a chatbot",
  "need an ai chatbot",
  "need an ai agent",
  "looking for an ai agent",
  "need automation",
  "looking for automation",
  "looking for a freelancer",
  "looking for a developer",
];

const MEDIUM_SIGNALS = [
  "how much would it cost",
  "how much does it cost",
  "recommend a developer",
  "recommend an agency",
  "who can build",
  "what would it cost",
  "planning to build",
  "want to build",
  "thinking about building",
];

const LOW_SIGNALS = [
  "what is ai",
  "what is automation",
  "how does ai work",
  "just curious",
  "hypothetical",
  "for learning",
  "tutorial",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}

function findSignals(
  text: string,
  signals: string[]
): string[] {
  return signals.filter((signal) =>
    text.includes(signal)
  );
}

export function assessBuyingIntent(
  text: string
): BuyingIntentAssessment {
  const normalized = normalize(text);

  const veryHigh = findSignals(
    normalized,
    VERY_HIGH_SIGNALS
  );

  const high = findSignals(
    normalized,
    HIGH_SIGNALS
  );

  const medium = findSignals(
    normalized,
    MEDIUM_SIGNALS
  );

  const low = findSignals(
    normalized,
    LOW_SIGNALS
  );

  if (veryHigh.length > 0) {
    return {
      intent: "VERY_HIGH",
      score: 30,
      signals: veryHigh,
    };
  }

  if (high.length >= 2) {
    return {
      intent: "HIGH",
      score: 27,
      signals: high,
    };
  }

  if (high.length === 1) {
    return {
      intent: "HIGH",
      score: 24,
      signals: high,
    };
  }

  if (medium.length > 0) {
    return {
      intent: "MEDIUM",
      score: 17,
      signals: medium,
    };
  }

  if (low.length > 0) {
    return {
      intent: "LOW",
      score: 5,
      signals: low,
    };
  }

  return {
    intent: "UNCLEAR",
    score: 0,
    signals: [],
  };
}