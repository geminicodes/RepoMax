# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Bun installed - [install Bun](https://bun.sh/docs/installation)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
bun install

# Step 4: Start the development server with auto-reloading and an instant preview.
bun run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Bun 1.3.4
- Vite 7.2.7
- TypeScript
- React 19.2.1
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

<<<<<<< HEAD
## Tone detection (Google Cloud Natural Language)

- **Endpoint**: `POST /api/v1/analyze` returns a `ToneAnalysis` object (auth required).
- **Caching**: in-memory LRU+TTL (default **24h**) to target ~60–80% hit rate.
- **Language**: heuristic `en`/`es` detection; NL sentiment/entities run for both; text classification runs for `en` when supported.

## Authentication + persistence (Firebase Auth + Firestore)

- **Auth**: client signs in (email/password or Google OAuth) → obtains Firebase ID token → sends `Authorization: Bearer <token>` to the API.
- **Server verification**: Admin SDK verifies the token, loads the user tier from Firestore, and attaches `req.user = { uid, email, tier }`.
- **Tiers**
  - **free**: 3 analyses/month, **no history stored**
  - **pro**: unlimited, analysis + README history stored

### Frontend integration (example)

```ts
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const app = initializeApp({ apiKey, authDomain, projectId });
const auth = getAuth(app);

const cred = await signInWithEmailAndPassword(auth, email, password);
const idToken = await cred.user.getIdToken();

await fetch("/api/v1/analyze", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${idToken}`
  },
  body: JSON.stringify({ githubUsername, jobUrl, jobTitle, description })
});
```

### Firestore rules

This repo includes `firestore.rules` with per-user read access to `users`, `analyses`, and `readmes`.

## Google Cloud setup (required services)
=======
## Can I connect a custom domain to my Lovable project?
>>>>>>> origin/frontend-lovable

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

<<<<<<< HEAD
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
   - `FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account", ...}'` (recommended for server auth + Firestore)

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
=======
Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
>>>>>>> origin/frontend-lovable
