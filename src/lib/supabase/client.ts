import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * Client-side Supabase client. Uses the public anon key only —
 * safe to call from browser code. Row Level Security enforces
 * per-user access, so this key alone can never leak other users' data.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
