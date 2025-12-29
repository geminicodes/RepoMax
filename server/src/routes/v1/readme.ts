import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import type { GenerateReadmeRequest } from "@readyrepo/shared";
import { HttpError } from "../../errors/httpError";
import { generateEnhancedReadme } from "../../services/readmeGenerationService";

const repoSchema = z.object({
  name: z.string().min(1),
  fullName: z.string().min(1),
  htmlUrl: z.string().url(),
  description: z.string().nullable(),
  languages: z.array(z.string()),
  stars: z.number(),
  forks: z.number(),
  updatedAt: z.string(),
  defaultBranch: z.string().min(1),
  readme: z.string().nullable(),
  topics: z.array(z.string())
});

const jobSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  company: z.string().nullable(),
  description: z.string(),
  requirements: z.array(z.string()),
  skills: z.array(z.string()),
  experienceLevel: z.string().nullable(),
  rawText: z.string()
});

const generateReadmeSchema = z.object({
  repo: repoSchema,
  currentReadme: z.string().nullable().optional(),
  job: jobSchema
});

/**
 * README generation endpoints mounted at:
 * - `/api/v1/generate-readme`
 * - (alias) `/api/generate-readme`
 */
export function readmeRouter() {
  const router = Router();

  // Stricter than global limiter to prevent abuse.
  router.use(
    rateLimit({
      windowMs: 60_000,
      limit: 10,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  router.post("/", async (req, res, next) => {
    try {
      const parsed = generateReadmeSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(
          new HttpError({
            statusCode: 400,
            publicMessage: "Invalid request.",
            internalMessage: "Generate README validation failed",
            details: { issues: parsed.error.issues }
          })
        );
      }

      const input = parsed.data as GenerateReadmeRequest;
      const result = await generateEnhancedReadme(input);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

