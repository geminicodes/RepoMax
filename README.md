# ReadyRepo — GitHub Job Fit Analyzer (MVP Foundation)

ReadyRepo analyzes a GitHub profile against a job posting, producing a fit score, repo-by-repo recommendations, and a tone-matched README draft (Spanish + English friendly).

## Monorepo structure

- **`client/`**: React 18 + Vite + TypeScript
- **`server/`**: Express + TypeScript API (`/api/v1/...`)
- **`shared/`**: Shared TypeScript types/utilities

## Prerequisites

- Node.js **20+**
- npm **9+** (workspaces enabled)

## Quick start

1) Install dependencies:

```bash
npm install
```

2) Create env files:

```bash
cp .env.example .env
cp client/.env.example client/.env.local
```

3) Validate env vars:

```bash
npm run env:check
```

4) Run locally (client + server):

```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:8080/api/health`

## Generate an improved README (copy/paste ready)

- **Endpoint**: `POST /api/generate-readme` (alias of `POST /api/v1/generate-readme`)
- **UI**: open the client at `http://localhost:5173` and use the README Generator screen.

## Google Cloud setup (required services)

### Gemini API key (AI Studio)

- Go to Google AI Studio and create an API key.
- Set:
  - `GEMINI_API_KEY=...`
  - `GEMINI_MODEL=gemini-1.5-flash` (recommended for speed)

### Cloud Natural Language API

1) Create/choose a Google Cloud project
2) Enable **Cloud Natural Language API**
3) Create credentials:
   - Recommended for local dev: **Service Account JSON**
4) Provide credentials via either:
   - `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json` (recommended), OR
   - `GCP_SERVICE_ACCOUNT_JSON='{"type":"service_account", ...}'` (raw JSON string)

Also set:
- `GCP_PROJECT_ID=your-project-id`

### Firebase (Firestore + Admin SDK)

1) Create a Firebase project (or link an existing GCP project)
2) Enable **Firestore**
3) Generate a **service account key** (Project Settings → Service accounts)
4) Provide credentials via the same mechanism as above:
   - `GOOGLE_APPLICATION_CREDENTIALS=...` OR `GCP_SERVICE_ACCOUNT_JSON=...`
5) Set:
   - `FIREBASE_PROJECT_ID=your-firebase-project-id`

**Planned collections**
- `users`: user profiles + preferences
- `analyses`: analysis runs (input + outputs + timestamps)
- `feedback`: user feedback on recommendations/READMEs

### Google Analytics 4 (GA4)

1) Create a GA4 property and get a Measurement ID like `G-XXXXXXXXXX`
2) Set in `client/.env.local`:
   - `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

## Health checks

- `GET /api/health`: server status + external service status (GitHub + Google services).
- Startup checks:
  - Env vars are validated on boot.
  - Reachability checks run with tight timeouts; failures do **not** leak stack traces to clients.

## Scripts

- `npm run dev`: run client + server concurrently
- `npm run build`: build shared, server, and client
- `npm run env:check`: validate required environment variables