import { NextResponse } from "next/server";

/**
 * Minimal liveness/config check. Reports which required env vars are
 * missing without ever echoing their values back — safe to hit from
 * a browser or uptime monitor.
 */
export async function GET() {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const missing = requiredVars.filter((name) => !process.env[name]);

  return NextResponse.json({
    ok: missing.length === 0,
    missingEnvVars: missing,
    aiProvider: process.env.AI_PROVIDER ?? "mock",
    checkedAt: new Date().toISOString(),
  });
}
