import { Router } from "express";

/**
 * Placeholder history endpoints.
 */
export function historyRouter() {
  const router = Router();
  router.get("/", (_req, res) => {
    res.status(501).json({ success: false, error: "History endpoint not implemented in this build." });
  });
  return router;
}

