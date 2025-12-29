import type pino from "pino";
import { getEnv } from "./config/env";

/**
 * Optional startup checks (kept intentionally lightweight).
 *
 * In production you might extend this to:
 * - validate credentials format
 * - warm caches
 * - verify connectivity to critical services
 */
export async function runStartupChecks(logger?: pino.Logger) {
  const env = getEnv();
  const log = logger ?? console;

  log.info(
    {
      geminiConfigured: Boolean(env.GEMINI_API_KEY),
      geminiModel: env.GEMINI_MODEL
    },
    "startup_checks_complete"
  );
}

