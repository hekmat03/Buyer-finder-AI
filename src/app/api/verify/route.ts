import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  verifyCandidate,
} from "@/lib/discovery/verification";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    if (
      !body?.candidate ||
      typeof body.candidate !==
        "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Candidate is required.",
        },
        { status: 400 }
      );
    }

    const result =
      await verifyCandidate(
        body.candidate
      );

    return NextResponse.json({
      success: true,
      verification: result,
    });
  } catch (error) {
    console.error(
      "Verification API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Verification failed.",
      },
      { status: 500 }
    );
  }
}