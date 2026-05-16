// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Vercel sets VERCEL=1 during build and runtime. Cloudflare Workers output does not run on Vercel.
const isVercel = Boolean(process.env.VERCEL);

export default defineConfig({
  // Cloudflare plugin only for non-Vercel builds (local wrangler preview).
  cloudflare: isVercel ? false : undefined,
  tanstackStart: isVercel
    ? {}
    : {
        // Custom SSR error wrapper for Cloudflare — see src/server.ts
        server: { entry: "server" },
      },
  plugins: isVercel ? [nitro()] : [],
});
