import { NextRequest, NextResponse } from "next/server";

import {
  runRedditDiscovery,
} from "@/lib/discovery/run";

import type {
  SupportedService,
} from "@/lib/discovery/service-match";

const SUPPORTED_SERVICES: SupportedService[] = [
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
    const body = await request.json();

    const service =
      typeof body?.service === "string"
        ? body.service.trim()
        : "";

    if (
      !SUPPORTED_SERVICES.includes(
        service as SupportedService
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select a valid service.",
          supportedServices:
            SUPPORTED_SERVICES,
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
                typeof value === "string"
            )
            .map(
              (value) => value.trim()
            )
            .filter(Boolean)
            .slice(0, 10)
        : undefined;

    const limit =
      typeof body?.limit === "number"
        ? Math.min(
            Math.max(
              Math.floor(body.limit),
              1
            ),
            50
          )
        : 25;

    const result =
      await runRedditDiscovery(
        service as SupportedService,
        keywords,
        limit
      );

    return NextResponse.json({
      success: true,
      source: "reddit",
      ...result,
    });
  } catch (error) {
    console.error(
      "Discovery route error:",
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