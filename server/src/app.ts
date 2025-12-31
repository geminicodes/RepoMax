import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { getEnv } from "./config/env";
import { createLogger } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";
import { requestTimeout } from "./middleware/requestTimeout";
import { apiRouter } from "./routes";

/**
 * Create the Express application with production-ready middleware order.
 */
export function createApp() {
  const env = getEnv();
  const logger = createLogger();
  const app = express();

  app.set("trust proxy", 1);

  app.use(pinoHttp({ logger }));
  app.use(requestTimeout());
  app.use(helmet());
  app.use(compression());

  /**
   * CORS
   *
   * - In Codespaces/dev, the frontend origin is often a forwarded URL
   *   like `https://<name>-5173.app.github.dev`, not `http://localhost:5173`.
   *   Reflecting the request Origin in development avoids repeated CORS failures.
   * - In production, restrict to the configured `CLIENT_ORIGIN`.
   */
  app.use(
    cors({
      origin:
        env.NODE_ENV === "development"
          ? true
          : (process.env.FRONTEND_URL ?? env.CLIENT_ORIGIN),
      credentials: true
    })
  );

  app.use(express.json({ limit: "1mb" }));

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  // Friendly root page for Codespaces port forwarding (API is mounted at /api).
  app.get("/", (_req, res) => {
    res
      .status(200)
      .type("html")
      .send(
        [
          "<!doctype html>",
          "<html>",
          "<head><meta charset='utf-8'><title>ReadyRepo API</title></head>",
          "<body style='font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px'>",
          "<h1>ReadyRepo API is running</h1>",
          "<p>This port serves the backend API. Try:</p>",
          "<ul>",
          "<li><a href='/api/health'>/api/health</a></li>",
          "<li><a href='/api/v1'>/api/v1</a></li>",
          "</ul>",
          "<p>For the web UI in Codespaces, open the forwarded port for the Vite dev server (usually <b>5173</b>).</p>",
          "</body>",
          "</html>"
        ].join("")
      );
  });

  app.use("/api", apiRouter());

  app.use(errorHandler);
  return app;
}
