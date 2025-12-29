"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = apiRouter;
const express_1 = require("express");
const v1_1 = require("./v1");
const health_1 = require("./health");
const readme_1 = require("./v1/readme");
/**
 * Top-level API router mounted at `/api`.
 */
function apiRouter() {
    const router = (0, express_1.Router)();
    router.use("/health", (0, health_1.healthRouter)());
    // Non-versioned alias (requested): `/api/generate-readme`
    router.use("/generate-readme", (0, readme_1.readmeRouter)());
    router.use("/v1", (0, v1_1.v1Router)());
    return router;
}
