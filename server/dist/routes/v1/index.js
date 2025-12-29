"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = v1Router;
const express_1 = require("express");
const analyze_1 = require("./analyze");
const readme_1 = require("./readme");
const feedback_1 = require("./feedback");
const history_1 = require("./history");
/**
 * API v1 router mounted at `/api/v1`.
 */
function v1Router() {
    const router = (0, express_1.Router)();
    router.use("/analyze", (0, analyze_1.analyzeRouter)());
    router.use("/generate-readme", (0, readme_1.readmeRouter)());
    router.use("/feedback", (0, feedback_1.feedbackRouter)());
    router.use("/history", (0, history_1.historyRouter)());
    return router;
}
