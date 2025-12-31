"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readmeRouter = readmeRouter;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const zod_1 = require("zod");
const httpError_1 = require("../../errors/httpError");
const readmeGenerationService_1 = require("../../services/readmeGenerationService");
const auth_1 = require("../../middleware/auth");
const firestoreService_1 = require("../../services/firestoreService");
const toneAnalyzer_1 = require("../../services/toneAnalyzer");
const repoSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    fullName: zod_1.z.string().min(1),
    htmlUrl: zod_1.z.string().url(),
    description: zod_1.z.string().nullable(),
    languages: zod_1.z.array(zod_1.z.string()),
    stars: zod_1.z.number(),
    forks: zod_1.z.number(),
    updatedAt: zod_1.z.string(),
    defaultBranch: zod_1.z.string().min(1),
    readme: zod_1.z.string().nullable(),
    topics: zod_1.z.array(zod_1.z.string())
});
const jobSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    title: zod_1.z.string().min(1),
    company: zod_1.z.string().nullable(),
    description: zod_1.z.string(),
    requirements: zod_1.z.array(zod_1.z.string()),
    skills: zod_1.z.array(zod_1.z.string()),
    experienceLevel: zod_1.z.string().nullable(),
    rawText: zod_1.z.string()
});
const generateReadmeSchema = zod_1.z.object({
    repo: repoSchema,
    currentReadme: zod_1.z.string().nullable().optional(),
    job: jobSchema,
    analysisId: zod_1.z.string().nullable().optional()
});
/**
 * README generation endpoints mounted at:
 * - `/api/v1/generate-readme`
 * - (alias) `/api/generate-readme`
 */
function readmeRouter() {
    const router = (0, express_1.Router)();
    // Stricter than global limiter to prevent abuse.
    router.use((0, express_rate_limit_1.default)({
        windowMs: 60_000,
        limit: 10,
        standardHeaders: "draft-7",
        legacyHeaders: false
    }));
    router.post("/", auth_1.authenticateUser, async (req, res, next) => {
        try {
            const parsed = generateReadmeSchema.safeParse(req.body);
            if (!parsed.success) {
                return next(new httpError_1.HttpError({
                    statusCode: 400,
                    publicMessage: "Invalid request.",
                    internalMessage: "Generate README validation failed",
                    details: { issues: parsed.error.issues }
                }));
            }
            const user = req.user;
            const input = parsed.data;
            const result = await (0, readmeGenerationService_1.generateEnhancedReadme)(input);
            let readmeId = null;
            if (user.tier === "pro") {
                const tone = await (0, toneAnalyzer_1.analyzeJobTone)(input.job.description, input.job.url, req.log);
                const saved = await (0, firestoreService_1.saveGeneratedREADME)({
                    userId: user.uid,
                    analysisId: parsed.data.analysisId ?? null,
                    repoName: input.repo.name,
                    repoUrl: input.repo.htmlUrl,
                    originalREADME: input.currentReadme ?? input.repo.readme ?? null,
                    generatedREADME: result.generatedReadme,
                    tone,
                    jobContext: {
                        jobUrl: input.job.url,
                        jobTitle: input.job.title,
                        company: input.job.company
                    }
                });
                readmeId = saved.readmeId;
            }
            res.json({ success: true, data: { ...result, readmeId } });
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}
//# sourceMappingURL=readme.js.map