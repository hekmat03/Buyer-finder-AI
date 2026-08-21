import { UNKNOWN, type NormalizedCandidate } from "@/lib/types/domain";
import type {
  AIProvider,
  BuyerClassificationResult,
  ExtractionResult,
  IntentAnalysis,
} from "@/lib/providers/ai-provider";

/**
 * DEVELOPMENT-ONLY mock. Deliberately conservative: it never invents
 * a budget or contact detail and defaults every judgment call to the
 * lowest-confidence answer, so a search run wired to this provider
 * cannot silently produce fake "qualified" leads. Do not point
 * AI_PROVIDER at "mock" in production — it exists purely so the rest
 * of the pipeline (dedup, scoring, dashboard) can be built and tested
 * before a real API key is configured.
 */
export class MockAIProvider implements AIProvider {
  readonly id = "mock";

  async analyzeIntent(candidate: NormalizedCandidate): Promise<IntentAnalysis> {
    const strongSignals = [
      "looking for a developer",
      "need someone to build",
      "hiring someone",
      "need an ai agent",
      "looking to automate",
      "my budget is",
      "need a website",
    ];
    const text = candidate.normalizedText;
    const hit = strongSignals.find((s) => text.includes(s));

    return {
      intent: hit ? "MEDIUM" : "UNCLEAR",
      reasoning: hit
        ? `Matched keyword heuristic "${hit}" (mock provider — not a real judgment).`
        : "No strong buying-intent keyword matched (mock provider).",
      buyingSignalQuote: hit ?? null,
    };
  }

  async classifyBuyer(): Promise<BuyerClassificationResult> {
    return {
      classification: "UNCLEAR",
      reasoning: "Mock provider does not perform real buyer classification.",
    };
  }

  async extractOpportunity(): Promise<ExtractionResult> {
    return {
      buyer: {
        name: UNKNOWN.NOT_PROVIDED,
        place: UNKNOWN.NOT_PROVIDED,
        whatsapp: UNKNOWN.NOT_PROVIDED,
        phone: UNKNOWN.NOT_PROVIDED,
        email: UNKNOWN.NOT_PROVIDED,
        location: UNKNOWN.NOT_PROVIDED,
        business: UNKNOWN.NOT_PROVIDED,
      },
      opportunity: {
        buyerIntent: "UNCLEAR",
        budget: UNKNOWN.NOT_PROVIDED,
        service: UNKNOWN.UNCLEAR,
        source: "mock",
        opportunity: UNKNOWN.UNCLEAR,
        why: "Mock provider does not perform real extraction.",
        buyingSignalQuote: UNKNOWN.NOT_PROVIDED,
        originalUrl: UNKNOWN.NOT_PROVIDED,
      },
    };
  }

  async generateIcebreaker(): Promise<string> {
    return "[mock provider — no icebreaker generated]";
  }
}
