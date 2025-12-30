import { Router } from "express";
import { analyzeRouter } from "./analyze";
import { readmeRouter } from "./readme";
import { feedbackRouter } from "./feedback";
import { historyRouter } from "./history";

/**
 * API v1 router mounted at `/api/v1`.
 */
export function v1Router() {
  const router = Router();
  router.use("/analyze", analyzeRouter());
  router.use("/generate-readme", readmeRouter());
  router.use("/feedback", feedbackRouter());
  router.use("/history", historyRouter());
  return router;
}
