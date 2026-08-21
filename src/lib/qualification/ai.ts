import type {
  QualificationInput,
  QualificationResult,
} from "./types";

const MISTRAL_API_URL =
  "https://api.mistral.ai/v1/chat/completions";

function getApiKey(): string {
  const key = process.env.MISTRAL_API_KEY;

  if (!key) {
    throw new Error(
      "MISTRAL_API_KEY is not configured."
    );
  }

  return key;
}

function cleanJson(value: string): string {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function qualifyOpportunity(
  input: QualificationInput
): Promise<QualificationResult> {
  const systemPrompt = `
You are BuyerFinder AI's opportunity qualification engine.

Analyze only the information provided.

NEVER invent:
- names
- emails
- phone numbers
- budgets
- timelines
- companies
- requirements
- contact information

If information is missing, return "Not provided".
If uncertain, return "Unclear".

Return ONLY valid JSON.

Required schema:
{
  "summary": "string",
  "problem": "string",
  "requestedService": "string",
  "buyingIntent": "VERY_HIGH|HIGH|MEDIUM|LOW|UNCLEAR",
  "intentReason": "string",
  "serviceMatch": "EXACT|STRONG|POSSIBLE|WEAK|NONE",
  "budgetEvidence": "string",
  "timeline": "string",
  "businessValue": 0,
  "contactability": "DIRECT_CONTACT|PUBLIC_CONTACT|PLATFORM_ONLY|NO_CONTACT|UNKNOWN",
  "riskFlags": [],
  "recommendedAction": "string",
  "qualificationNotes": "string"
}

businessValue must be an integer from 0 to 10.
`;

  const userPrompt = JSON.stringify({
    source: input.source,
    sourceUrl: input.sourceUrl,
    title: input.title,
    content: input.content,
    publishedAt: input.publishedAt,
    requestedService: input.requestedService,
  });

  const response = await fetch(
    MISTRAL_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model:
          process.env.MISTRAL_MODEL ??
          "mistral-small-latest",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Mistral qualification failed with HTTP ${response.status}.`
    );
  }

  const data = await response.json();

  const content =
    data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error(
      "Mistral returned an invalid qualification response."
    );
  }

  try {
    const parsed = JSON.parse(cleanJson(content));

    return validateQualification(parsed);
  } catch {
    throw new Error(
      "AI qualification returned malformed JSON."
    );
  }
}

function validateQualification(
  value: unknown
): QualificationResult {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error(
      "Qualification result is not an object."
    );
  }

  const data = value as Record<string, unknown>;

  const requiredStrings = [
    "summary",
    "problem",
    "requestedService",
    "intentReason",
    "budgetEvidence",
    "timeline",
    "recommendedAction",
    "qualificationNotes",
  ];

  for (const field of requiredStrings) {
    if (typeof data[field] !== "string") {
      throw new Error(
        `Invalid qualification field: ${field}`
      );
    }
  }

  if (
    typeof data.businessValue !== "number" ||
    data.businessValue < 0 ||
    data.businessValue > 10
  ) {
    throw new Error(
      "businessValue must be between 0 and 10."
    );
  }

  if (!Array.isArray(data.riskFlags)) {
    throw new Error(
      "riskFlags must be an array."
    );
  }

  return {
    summary: data.summary as string,
    problem: data.problem as string,
    requestedService:
      data.requestedService as string,
    buyingIntent:
      data.buyingIntent as QualificationResult["buyingIntent"],
    intentReason:
      data.intentReason as string,
    serviceMatch:
      data.serviceMatch as QualificationResult["serviceMatch"],
    budgetEvidence:
      data.budgetEvidence as string,
    timeline:
      data.timeline as string,
    businessValue:
      data.businessValue as number,
    contactability:
      data.contactability as QualificationResult["contactability"],
    riskFlags:
      data.riskFlags.filter(
        (item): item is string =>
          typeof item === "string"
      ),
    recommendedAction:
      data.recommendedAction as string,
    qualificationNotes:
      data.qualificationNotes as string,
  };
}