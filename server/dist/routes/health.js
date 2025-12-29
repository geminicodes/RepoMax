"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = healthRouter;
const express_1 = require("express");
const healthService_1 = require("../services/healthService");
/**
 * Health endpoints.
 */
function healthRouter() {
    const router = (0, express_1.Router)();
    router.get("/", async (req, res) => {
        try {
            const health = await (0, healthService_1.getServiceHealthSnapshot)();
            const statusCode = health.ok ? 200 : 503;
            res.status(statusCode).json({ success: true, data: health });
        }
        catch (err) {
            req.log?.error({ err }, "health_check_failed");
            res.status(503).json({ success: false, error: "Service unhealthy." });
        }
    });
    return router;
}
