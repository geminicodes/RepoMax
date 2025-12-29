"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceHealthSnapshot = getServiceHealthSnapshot;
const env_1 = require("../config/env");
/**
 * Lightweight health snapshot (no external network calls).
 *
 * Note: we intentionally avoid pinging third parties from the health endpoint
 * to keep it fast, cheap, and reliable.
 */
async function getServiceHealthSnapshot() {
    const env = (0, env_1.getEnv)();
    const geminiConfigured = Boolean(env.GEMINI_API_KEY);
    const githubConfigured = Boolean(env.GITHUB_TOKEN);
    const warnings = [];
    if (!geminiConfigured)
        warnings.push("GEMINI_API_KEY is not configured.");
    if (!githubConfigured)
        warnings.push("GITHUB_TOKEN is not configured (lower rate limits).");
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
