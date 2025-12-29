import { Router } from "express";

/**
 * Placeholder feedback endpoints.
 */
export function feedbackRouter() {
  const router = Router();
  router.post("/", (_req, res) => {
    res.status(501).json({ success: false, error: "Feedback endpoint not implemented in this build." });
  });
  return router;
}

