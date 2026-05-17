# Code Pulse

**Behavioral engineering intelligence for technical hiring** — understand how engineers think during coding assessments, not just what they submit.

Code Pulse is a full-stack web app with separate **Candidate** and **Recruiter** experiences: live coding interviews, behavioral telemetry, session replay, and recruiter intelligence dashboards.

---

## Live repository

**GitHub:** [https://github.com/bhavya1919/CodePulse](https://github.com/bhavya1919/CodePulse)

---

## Features

| Area | Description |
|------|-------------|
| **Authentication** | Email/password sign-up and login via Supabase Auth (candidate vs recruiter roles) |
| **Candidate interview** | Monaco code editor, multi-language templates, live behavioral telemetry |
| **Session replay** | Timeline replay of coding events and metrics |
| **Recruiter dashboard** | Pipeline view, live monitoring, reports, PDF export |
| **Candidate dashboard** | Session history and cognitive insights (role-based UI) |
| **Landing page** | Product overview and enterprise positioning |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based routes) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + Radix UI (shadcn-style components) |
| Auth & backend | [Supabase](https://supabase.com/) (Auth; optional Postgres for future features) |
| Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Charts / PDF | Recharts, jsPDF |
| Build | [Vite 7](https://vitejs.dev/) |
| Deploy | [Vercel](https://vercel.com/) (Nitro) or Cloudflare Workers (local preview) |

---

## Prerequisites

- **Node.js** 20+ and **npm** 10+
- **Git**
- A **Supabase** project (free tier is fine)
- (Optional) **Vercel** account for deployment

---

## Quick start (team setup)

### 1. Clone the repository

```bash
git clone https://github.com/bhavya1919/CodePulse.git
cd CodePulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

Get values from **Supabase Dashboard → Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon** or **publishable** public key → `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)

> **Never commit `.env.local`** — it is listed in `.gitignore`.

### 4. Configure Supabase Auth

In your Supabase project:

1. **Authentication → Providers** — enable **Email**
2. **Authentication → URL Configuration**
   - **Site URL:** `http://localhost:5173` (or the port Vite prints)
   - **Redirect URLs:** `http://localhost:5173/**`

For production, add your Vercel URL the same way.

### 5. Run the development server

```bash
npm run dev
```

Open the URL shown in the terminal (often `http://localhost:5173` or `http://localhost:8080`).

### 6. Create accounts

1. Go to `/register` — choose **Candidate** or **Recruiter**
2. Go to `/login` — use the **same role tab** as when you registered
3. After login:
   - **Recruiter** → `/dashboard`
   - **Candidate** → `/interview`

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Production build (`dist/client` + server output) |
| `npm run build:dev` | Development mode build |
| `npm run preview` | Preview Cloudflare Workers build locally (Wrangler) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

Regenerate favicons after changing `public/favicon.png`:

```bash
node scripts/generate-favicons.mjs
```

---

## Project structure

```
CodePulse/
├── public/                 # Static assets (favicon, logos)
├── src/
│   ├── routes/             # File-based pages (TanStack Router)
│   │   ├── index.tsx       # Landing page
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── interview.tsx   # Candidate coding session
│   │   ├── dashboard.tsx   # Recruiter / candidate hub
│   │   ├── replay.tsx      # Session replay
│   │   └── __root.tsx      # Root layout, meta, providers
│   ├── components/
│   │   ├── site/           # Navbar, background, sparkline
│   │   └── ui/             # Reusable UI primitives
│   ├── lib/
│   │   ├── auth-context.tsx    # Supabase auth state
│   │   ├── supabase.ts         # Supabase client
│   │   ├── telemetry-store.ts  # Behavioral session (localStorage)
│   │   └── demo-scenarios.ts   # Demo data loaders
│   ├── server.ts           # SSR entry (Cloudflare)
│   └── styles.css
├── scripts/
│   └── generate-favicons.mjs
├── .env.example            # Env template (commit this)
├── vite.config.ts
└── package.json
```

---

## Authentication & roles

Roles are stored in Supabase **user metadata** (`role`: `candidate` | `recruiter`).

- **Register** (`/register`) — sets `name` and `role` in metadata
- **Login** (`/login`) — the selected role tab is used for routing and synced to the profile
- **Route guards**
  - Recruiters on `/interview` → redirected to `/dashboard`
  - Candidates on `/dashboard` → redirected to `/interview`

---

## Data storage

| Data | Where it lives |
|------|----------------|
| User accounts | Supabase Auth |
| Interview telemetry (sessions, events) | Browser `localStorage` via `TelemetryStore` |
| Future persistence | Supabase Postgres tables (not required for current demo flow) |

---

## Deployment (Vercel)

1. Push code to GitHub
2. Import the repo in [Vercel](https://vercel.com/) — preset **TanStack Start**
3. Add environment variables (same as `.env.local`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy
5. Add your Vercel URL to Supabase **Authentication → URL Configuration**

The build uses **Nitro** on Vercel (`VERCEL=1`) and **Cloudflare** output for local Wrangler preview.

---

## Deployment (Cloudflare Workers)

```bash
npm run build
npm run preview
```

Uses `wrangler.jsonc` and `src/server.ts`. Set secrets via `.env.local` (copied to `dist/server/.dev.vars` on build).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Login fails | Check `.env.local`, restart `npm run dev`, verify Supabase Email provider is on |
| Wrong dashboard after login | Log in with the correct **Recruiter** / **Candidate** tab; check user metadata in Supabase |
| Supabase not configured | Ensure both `VITE_*` vars are set and rebuild/restart |
| Build fails on Vercel | Confirm env vars are set for **Production** and redeploy |
| Favicon looks tiny in tab | Hard refresh (`Ctrl+Shift+R`); run `node scripts/generate-favicons.mjs` |

---

## Updating your local copy

```bash
git pull origin main
npm install
npm run dev
```

---

## Security notes

- Do not commit `.env.local`, API keys, or service role keys
- Use only the **public** Supabase anon/publishable key in the frontend
- Enable Row Level Security (RLS) if you add Postgres tables

---

## License

Private / team use — update this section if you add an open-source license.

---

## Contributors

Built by the Code Pulse team. For questions, open an issue on GitHub or contact the repository owner.
