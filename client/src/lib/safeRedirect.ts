/**
 * Ensure client-side redirects stay within this SPA.
 *
 * React Router `navigate()` accepts strings that can be abused if an attacker
 * ever influences them (e.g. `//evil.com`, `https://evil.com`, or `javascript:`).
 */
export function safeInternalRedirect(to: string | null | undefined, fallback = "/analyze"): string {
  const candidate = (to ?? "").trim();
  if (!candidate) return fallback;

  // Must be a path-absolute SPA route.
  if (!candidate.startsWith("/")) return fallback;

  // Disallow scheme-relative or protocol URLs.
  if (candidate.startsWith("//")) return fallback;
  if (candidate.includes("://")) return fallback;

  // Disallow control chars / obvious script-y payloads.
  if (/[\u0000-\u001F\u007F]/.test(candidate)) return fallback;
  if (/^\s*javascript:/i.test(candidate)) return fallback;

  return candidate;
}

