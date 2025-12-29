import { getEnv } from "../config/env";

export interface ServiceHealthSnapshot {
  ok: boolean;
  checkedAt: string; // ISO
  services: {
    gemini: { configured: boolean; model: string };
    github: { configured: boolean };
  };
  warnings: string[];
}

/**
 * Lightweight health snapshot (no external network calls).
 *
 * Note: we intentionally avoid pinging third parties from the health endpoint
 * to keep it fast, cheap, and reliable.
 */
export async function getServiceHealthSnapshot(): Promise<ServiceHealthSnapshot> {
  const env = getEnv();

  const geminiConfigured = Boolean(env.GEMINI_API_KEY);
  const githubConfigured = Boolean(env.GITHUB_TOKEN);

  const warnings: string[] = [];
  if (!geminiConfigured) warnings.push("GEMINI_API_KEY is not configured.");
  if (!githubConfigured) warnings.push("GITHUB_TOKEN is not configured (lower rate limits).");

  return {
    ok: true,
    checkedAt: new Date().toISOString(),
    services: {
      gemini: { configured: geminiConfigured, model: env.GEMINI_MODEL },
      github: { configured: githubConfigured }
    },
    warnings
  };
}

