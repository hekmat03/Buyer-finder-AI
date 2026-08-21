import {
  NextResponse,
} from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase =
      createSupabaseServerClient();

    const { data, error } =
      await supabase
        .from("opportunities")
        .select(
          "score, classification, buying_intent"
        );

    if (error) {
      throw new Error(
        error.message
      );
    }

    const opportunities =
      data ?? [];

    const total =
      opportunities.length;

    const highPriority =
      opportunities.filter(
        (item) =>
          item.classification ===
            "EXCEPTIONAL" ||
          item.classification ===
            "HOT" ||
          item.classification ===
            "STRONG"
      ).length;

    const averageScore =
      total > 0
        ? Math.round(
            opportunities.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.score ?? 0
                ),
              0
            ) / total
          )
        : 0;

    const veryHighIntent =
      opportunities.filter(
        (item) =>
          item.buying_intent ===
          "VERY_HIGH"
      ).length;

    return NextResponse.json({
      success: true,
      stats: {
        total,
        highPriority,
        averageScore,
        veryHighIntent,
      },
    });
  } catch (error) {
    console.error(
      "Opportunity stats error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load opportunity statistics.",
      },
      { status: 500 }
    );
  }
}