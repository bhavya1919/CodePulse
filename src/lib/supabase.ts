import { createClient } from "@supabase/supabase-js";

// You will need to provide these in your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
