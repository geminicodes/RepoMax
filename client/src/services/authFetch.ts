import { auth } from "@/config/firebase";

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken().catch(() => null);
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  if (res.status !== 401 && res.status !== 403) return res;

  // Retry once with a forced refresh (helps with expired tokens)
  const refreshed = await auth.currentUser?.getIdToken(true).catch(() => null);
  if (!refreshed) return res;

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set("Authorization", `Bearer ${refreshed}`);
  return fetch(input, { ...init, headers: retryHeaders });
}

