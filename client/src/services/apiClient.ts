import { auth } from "@/config/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

const MIN_FORCED_REFRESH_INTERVAL_MS = 60_000;
const AUTH_FAILURE_STATUSES = new Set([401, 403]);

let lastForcedRefreshAtMs = 0;
let forcedRefreshInFlight: Promise<string | null> | null = null;

async function forceRefreshIdTokenRateLimited(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  // Coalesce concurrent refreshes.
  if (forcedRefreshInFlight) return forcedRefreshInFlight;

  const now = Date.now();
  if (now - lastForcedRefreshAtMs < MIN_FORCED_REFRESH_INTERVAL_MS) {
    // Too soon to force refresh; fall back to cached token.
    return user.getIdToken().catch(() => null);
  }

  lastForcedRefreshAtMs = now;
  forcedRefreshInFlight = user
    .getIdToken(true)
    .catch(() => null)
    .finally(() => {
      forcedRefreshInFlight = null;
    });

  return forcedRefreshInFlight;
}

function clearClientStorageBestEffort() {
  try {
    localStorage.clear();
  } catch {
    // no-op
  }
  try {
    sessionStorage.clear();
  } catch {
    // no-op
  }
}

async function bestEffortSignOutForInvalidSession() {
  try {
    clearClientStorageBestEffort();
    await firebaseSignOut(auth);
  } catch {
    // no-op
  }
}

/**
 * Authenticated fetch:
 * - Injects `Authorization: Bearer <idToken>` on every request (if logged in)
 * - On 401/403, forces token refresh (rate-limited) and retries once
 * - If retry is still 401, signs out to force re-auth
 */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken().catch(() => null);
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  if (!AUTH_FAILURE_STATUSES.has(res.status)) return res;

  // Retry once with a forced refresh (helps with expired/revoked tokens).
  const refreshed = await forceRefreshIdTokenRateLimited();
  if (!refreshed) {
    if (res.status === 401) await bestEffortSignOutForInvalidSession();
    return res;
  }

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set("Authorization", `Bearer ${refreshed}`);
  const retry = await fetch(input, { ...init, headers: retryHeaders });

  if (retry.status === 401) await bestEffortSignOutForInvalidSession();
  return retry;
}

export function isUnauthorized(res: Response) {
  return res.status === 401;
}

