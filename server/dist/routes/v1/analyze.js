"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRouter = analyzeRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const httpError_1 = require("../../errors/httpError");
const toneAnalyzer_1 = require("../../services/toneAnalyzer");
const schema = zod_1.z.object({
    jobUrl: zod_1.z.string().url(),
    description: zod_1.z.string().min(1)
});
/**
 * Analyzer endpoints.
 *
 * Currently implemented:
 * - POST `/api/v1/analyze` -> returns NL-powered tone analysis for a job description.
 */
function analyzeRouter() {
    const router = (0, express_1.Router)();
    router.post("/", async (req, res, next) => {
        try {
            const parsed = schema.safeParse(req.body);
            if (!parsed.success) {
                return next(new httpError_1.HttpError({
                    statusCode: 400,
                    publicMessage: "Invalid request.",
                    internalMessage: "Analyze request validation failed",
                    details: { issues: parsed.error.issues }
                }));
            }
            const tone = await (0, toneAnalyzer_1.analyzeJobTone)(parsed.data.description, parsed.data.jobUrl, req.log);
            res.json({ success: true, data: { tone } });
        }
        catch (err) {
            // Tone analyzer already falls back internally; reaching here is unexpected.
            next(err);
        }
    });
    return router;
}
