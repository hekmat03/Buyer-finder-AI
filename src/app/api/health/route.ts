import {
  NextResponse,
} from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "ok",
    service: "BuyerFinder AI",
    timestamp:
      new Date().toISOString(),
  });
}