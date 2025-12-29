"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRouter = analyzeRouter;
const express_1 = require("express");
/**
 * Placeholder analyzer endpoints (not part of README generation feature).
 */
function analyzeRouter() {
    const router = (0, express_1.Router)();
    router.post("/", (_req, res) => {
        res.status(501).json({ success: false, error: "Analyze endpoint not implemented in this build." });
    });
    return router;
}
