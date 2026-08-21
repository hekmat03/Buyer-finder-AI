import {
  NextResponse,
} from "next/server";

export async function GET() {
  const checks = {
    application: true,
    mistral:
      Boolean(
        process.env.MISTRAL_API_KEY
      ),
    supabase:
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL
      ),
    supabaseServiceRole:
      Boolean(
        process.env.SUPABASE_SERVICE_ROLE_KEY
      ),
  };

  const healthy =
    checks.application &&
    checks.mistral &&
    checks.supabase &&
    checks.supabaseServiceRole;

  return NextResponse.json(
    {
      success: healthy,
      checks,
      timestamp:
        new Date().toISOString(),
    },
    {
      status: healthy
        ? 200
        : 503,
    }
  );
}