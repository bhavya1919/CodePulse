/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  /** Standard Supabase anon (public) key */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Newer Supabase publishable key (same role as anon for client SDK) */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
