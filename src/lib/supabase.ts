import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readEnv(...keys: (keyof ImportMetaEnv)[]): string | undefined {
  for (const key of keys) {
    const value = import.meta.env[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

const supabaseUrl = readEnv("VITE_SUPABASE_URL");
const supabaseKey = readEnv("VITE_SUPABASE_ANON_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY). Auth will be unavailable.",
  );
}

// Imported only on the client via auth-context.tsx dynamic import().
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;
