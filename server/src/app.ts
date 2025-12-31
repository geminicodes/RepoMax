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
  
  app.use(cors({
    origin: ['http://localhost:5173', process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true
  }));

  app.use(express.json({ limit: "1mb" }));

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  app.use("/api", apiRouter());

  app.use(errorHandler);
  return app;
}
