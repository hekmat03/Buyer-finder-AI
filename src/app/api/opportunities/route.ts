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

    const limit =
      value === null
        ? 50
        : Number(value);

    const opportunities =
      await listOpportunities(
        Number.isFinite(limit)
          ? limit
          : 50
      );

    return NextResponse.json({
      success: true,
      opportunities,
    });
  } catch (error) {
    console.error(
      "Opportunity list error:",
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