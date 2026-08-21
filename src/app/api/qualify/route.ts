import { NextRequest, NextResponse } from "next/server";

import {
  qualifyOpportunity,
} from "@/lib/qualification/ai";

import {
  calculateOpportunityScore,
} from "@/lib/scoring/opportunity-score";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      typeof body.content !== "string" ||
      !body.content.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Opportunity content is required.",
        },
        { status: 400 }
      );
    }

    const qualification =
      await qualifyOpportunity({
        title:
          typeof body.title === "string"
            ? body.title
            : null,
        content: body.content,
        source:
          typeof body.source === "string"
            ? body.source
            : "Unknown",
        sourceUrl:
          typeof body.sourceUrl === "string"
            ? body.sourceUrl
            : "",
        publishedAt:
          typeof body.publishedAt === "string"
            ? body.publishedAt
            : null,
        requestedService:
          typeof body.requestedService === "string"
            ? body.requestedService
            : "Unknown",
      });

    const score =
      calculateOpportunityScore(
        qualification,
        typeof body.freshnessScore === "number"
          ? body.freshnessScore
          : 0
      );

    return NextResponse.json({
      success: true,
      qualification,
      score,
    });
  } catch (error) {
    console.error(
      "Qualification API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Qualification failed.",
      },
      { status: 500 }
    );
  }
}