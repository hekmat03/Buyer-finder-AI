import {
  NextResponse,
} from "next/server";

import {
  getOpportunityById,
} from "@/lib/opportunities/repository";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Opportunity ID is required.",
        },
        { status: 400 }
      );
    }

    const opportunity =
      await getOpportunityById(id);

    if (!opportunity) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Opportunity not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      opportunity,
    });
  } catch (error) {
    console.error(
      "Opportunity detail error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load opportunity.",
      },
      { status: 500 }
    );
  }
}