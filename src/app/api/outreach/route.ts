import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  generateIcebreaker,
} from "@/lib/qualification/icebreaker";

import type {
  QualificationResult,
} from "@/lib/qualification/types";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    if (
      typeof body?.content !==
        "string" ||
      !body.content.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Opportunity content is required.",
        },
        { status: 400 }
      );
    }

    if (
      !body?.qualification ||
      typeof body.qualification !==
        "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Qualification data is required.",
        },
        { status: 400 }
      );
    }

    const allowedStyles = [
      "professional",
      "friendly",
      "direct",
      "consultative",
    ];

    const style =
      allowedStyles.includes(
        body.style
      )
        ? body.style
        : "professional";

    const message =
      await generateIcebreaker(
        body.content,
        body.qualification as QualificationResult,
        style
      );

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(
      "Outreach API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate outreach.",
      },
      { status: 500 }
    );
  }
}