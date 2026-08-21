import {
  NextResponse,
} from "next/server";

import {
  redditProvider,
} from "@/lib/providers/reddit";

export async function GET() {
  try {
    const health =
      await redditProvider.healthCheck();

    return NextResponse.json({
      success: true,
      source: "reddit",
      ...health,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        source: "reddit",
        ok: false,
      },
      { status: 503 }
    );
  }
}