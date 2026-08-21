import type {
  QualificationResult,
} from "./types";

const MISTRAL_API_URL =
  "https://api.mistral.ai/v1/chat/completions";

export type IcebreakerStyle =
  | "professional"
  | "friendly"
  | "direct"
  | "consultative";

export async function generateIcebreaker(
  content: string,
  qualification: QualificationResult,
  style: IcebreakerStyle = "professional"
): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "MISTRAL_API_KEY is not configured."
    );
  }

  const prompt = `
Create a short outreach message based ONLY on the opportunity below.

Style: ${style}

Rules:
- Do not invent facts.
- Do not claim previous contact.
- Do not pretend to know the person.
- Mention the actual problem/request when possible.
- Do not be spammy.
- Do not use exaggerated promises.
- Keep it under 100 words.
- End with a simple question or low-pressure call to action.

Opportunity:
${content}

Qualification:
${JSON.stringify(qualification)}
`;

  const response = await fetch(
    MISTRAL_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model:
          process.env.MISTRAL_MODEL ??
          "mistral-small-latest",
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content:
              "You write concise, honest B2B outreach drafts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Icebreaker generation failed with HTTP ${response.status}.`
    );
  }

  const data = await response.json();

  const result =
    data?.choices?.[0]?.message?.content;

  if (
    typeof result !== "string" ||
    !result.trim()
  ) {
    throw new Error(
      "AI returned an empty outreach draft."
    );
  }

  return result.trim();
}