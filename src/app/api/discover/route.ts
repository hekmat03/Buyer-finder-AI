import { NextRequest, NextResponse } from "next/server";

import {
  runDiscoveryPipeline,
} from "@/lib/discovery/pipeline";

import type {
  SupportedService,
} from "@/lib/discovery/service-match";

import {
  redditProvider,
} from "@/lib/providers/reddit";

const SUPPORTED_SERVICES: SupportedService[] = [
  "Web Development",
  "AI Agent",
  "AI Chatbot",
  "AI Automation",
  "SaaS Development",
  "Custom Software",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const service = body?.service as SupportedService;

    if (!service || !SUPPORTED_SERVICES.includes(service)) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid service is required.",
          supportedServices: SUPPORTED_SERVICES,
        },
        { status: 400 }
      );
    }

    const keywords = Array.isArray(body?.keywords)
      ? body.keywords
          .filter(
            (value: unknown): value is string =>
              typeof value === "string"
          )
          .map((value: string) => value.trim())
          .filter(Boolean)
          .slice(0, 10)
      : undefined;

    const location =
      typeof body?.location === "string"
        ? body.location.trim()
        : undefined;

    const limit =
      typeof body?.limit === "number"
        ? Math.min(Math.max(Math.floor(body.limit), 1), 100)
        : 25;

    const result = await runDiscoveryPipeline(
      redditProvider,
      {
        service,
        keywords,
        location,
        limit,
      },
      []
    );

    return NextResponse.json({
      success: true,
      source: "reddit",
      ...result,
    });
  } catch (error) {
    console.error("Discovery API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Discovery failed. Please try again.",
      },
      { status: 500 }
    );
  }
}