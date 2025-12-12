import { createApp } from "./app";
import { getEnv } from "./config/env";
import { runStartupChecks } from "./startupChecks";

async function main() {
  const env = getEnv();
  const app = createApp();

  if (env.STARTUP_CHECKS_ENABLED) {
    await runStartupChecks(app.get("logger") ?? undefined);
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
