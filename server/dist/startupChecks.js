"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStartupChecks = runStartupChecks;
const env_1 = require("./config/env");
/**
 * Optional startup checks (kept intentionally lightweight).
 *
 * In production you might extend this to:
 * - validate credentials format
 * - warm caches
 * - verify connectivity to critical services
 */
async function runStartupChecks(logger) {
    const env = (0, env_1.getEnv)();
    const log = logger ?? console;
    log.info({
        geminiConfigured: Boolean(env.GEMINI_API_KEY),
        geminiModel: env.GEMINI_MODEL
    }, "startup_checks_complete");
}
