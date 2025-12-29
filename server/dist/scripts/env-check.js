"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
/**
 * Validate environment variables and exit non-zero on failure.
 */
function main() {
    try {
        (0, env_1.getEnv)();
        // eslint-disable-next-line no-console
        console.log("Environment variables look valid.");
        process.exit(0);
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error("Environment validation failed:", err);
        process.exit(1);
    }
}
main();
