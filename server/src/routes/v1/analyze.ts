import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../../errors/httpError";
import { analyzeJobTone } from "../../services/toneAnalyzer";

const schema = z.object({
  jobUrl: z.string().url(),
  description: z.string().min(1)
});

/**
 * Analyzer endpoints.
 *
 * Currently implemented:
 * - POST `/api/v1/analyze` -> returns NL-powered tone analysis for a job description.
 */
export function analyzeRouter() {
  const router = Router();

  router.post("/", async (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return next(
          new HttpError({
            statusCode: 400,
            publicMessage: "Invalid request.",
            internalMessage: "Analyze request validation failed",
            details: { issues: parsed.error.issues }
          })
        );
      }

      const tone = await analyzeJobTone(parsed.data.description, parsed.data.jobUrl, req.log);
      res.json({ success: true, data: { tone } });
    } catch (err) {
      // Tone analyzer already falls back internally; reaching here is unexpected.
      next(err);
    }
  });

  return router;
}

