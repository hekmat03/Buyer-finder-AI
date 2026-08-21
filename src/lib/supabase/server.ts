import { createClient } from "@supabase/supabase-js";

function getEnvironmentVariable(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is not configured.`
    );
  }

  return value;
}

/**
 * Server-side Supabase client.
 *
 * This client uses the service-role key and therefore
 * must NEVER be exposed to the browser.
 */
export function createSupabaseServerClient() {
  return createClient(
    getEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_URL"
    ),
    getEnvironmentVariable(
      "SUPABASE_SERVICE_ROLE_KEY"
    ),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}