"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRouter = feedbackRouter;
const express_1 = require("express");
/**
 * Placeholder feedback endpoints.
 */
function feedbackRouter() {
    const router = (0, express_1.Router)();
    router.post("/", (_req, res) => {
        res.status(501).json({ success: false, error: "Feedback endpoint not implemented in this build." });
    });
    return router;
}
