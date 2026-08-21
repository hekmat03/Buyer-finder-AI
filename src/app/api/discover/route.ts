import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  discoverAndSave,
} from "@/lib/discovery/discover-and-save";

import {
  redditProvider,
} from "@/lib/providers/reddit";

import type {
  SupportedService,
} from "@/lib/discovery/service-match";

const SERVICES: SupportedService[] = [
  "Web Development",
  "AI Agent",
  "AI Chatbot",
  "AI Automation",
  "SaaS Development",
  "Custom Software",
];

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const service =
      body?.service as SupportedService;

    if (
      !service ||
      !SERVICES.includes(service)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid service is required.",
          supportedServices:
            SERVICES,
        },
        { status: 400 }
      );
    }

    const keywords =
      Array.isArray(body?.keywords)
        ? body.keywords
            .filter(
              (
                value: unknown
              ): value is string =>
                typeof value ===
                "string"
            )
            .map(
              (value) =>
                value.trim()
            )
            .filter(Boolean)
            .slice(0, 10)
        : undefined;

    const limit =
      typeof body?.limit ===
      "number"
        ? Math.min(
            Math.max(
              Math.floor(
                body.limit
              ),
              1
            ),
            50
          )
        : 25;

    const result =
      await discoverAndSave(
        redditProvider,
        {
          service,
          keywords,
          limit,
        }
      );

    return NextResponse.json({
      success: true,
      source: "reddit",
      ...result,
    });
  } catch (error) {
    console.error(
      "Discovery and save error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Discovery failed.",
      },
      { status: 500 }
    );
  }
}