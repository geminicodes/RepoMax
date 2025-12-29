import { Router } from "express";

/**
 * Placeholder analyzer endpoints (not part of README generation feature).
 */
export function analyzeRouter() {
  const router = Router();
  router.post("/", (_req, res) => {
    res.status(501).json({ success: false, error: "Analyze endpoint not implemented in this build." });
  });
  return router;
}

