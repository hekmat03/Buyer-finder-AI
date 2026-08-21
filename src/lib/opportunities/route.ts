import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  listOpportunities,
} from "@/lib/opportunities/repository";

export async function GET(
  request: NextRequest
) {
  try {
    const value =
      request.nextUrl.searchParams.get(
        "limit"
      );

    const limit = value
      ? Number(value)
      : 50;

    if (
      !Number.isFinite(limit) ||
      limit < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Limit must be a positive number.",
        },
        { status: 400 }
      );
    }

    const opportunities =
      await listOpportunities(limit);

    return NextResponse.json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    console.error(
      "Opportunities API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load opportunities.",
      },
      { status: 500 }
    );
  }
}