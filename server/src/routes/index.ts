import { Router } from "express";
import { v1Router } from "./v1";
import { healthRouter } from "./health";
import { readmeRouter } from "./v1/readme";

/**
 * Top-level API router mounted at `/api`.
 */
export function apiRouter() {
  const router = Router();
  router.use("/health", healthRouter());
  // Non-versioned alias (requested): `/api/generate-readme`
  router.use("/generate-readme", readmeRouter());
  router.use("/v1", v1Router());
  return router;
}
