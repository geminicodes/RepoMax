"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const startupChecks_1 = require("./startupChecks");
async function main() {
    const env = (0, env_1.getEnv)();
    const app = (0, app_1.createApp)();
    if (env.STARTUP_CHECKS_ENABLED) {
        await (0, startupChecks_1.runStartupChecks)(app.get("logger") ?? undefined);
    }
    app.listen(env.PORT, () => {
        // pino-http attaches req.log, but app-level logger isn't attached here.
        // Keep this minimal to avoid noisy startup logs.
        // eslint-disable-next-line no-console
        console.log(`ReadyRepo server listening on :${env.PORT}`);
    });
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Fatal startup error:", err);
    process.exit(1);
});
