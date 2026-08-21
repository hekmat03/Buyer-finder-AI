/**
 * Minimal hand-authored types matching supabase/migrations/0001_init.sql.
 * Once the Supabase project exists, regenerate the real thing with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/types/database.ts
 * This stub only covers what Phase 1 code needs to compile.
 */
export interface Database {
  public: {
    Tables: {
      sources: {
        Row: {
          id: string;
          display_name: string;
          enabled: boolean;
          last_health_check_at: string | null;
          last_health_ok: boolean | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sources"]["Row"]> & {
          id: string;
          display_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["sources"]["Row"]>;
      };
      opportunities: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      rejected_leads: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      search_runs: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      users: {
        Row: { id: string; email: string | null; created_at: string };
        Insert: { id: string; email?: string | null };
        Update: { email?: string | null };
      };
      saved_opportunities: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
}
