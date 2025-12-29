"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRouter = historyRouter;
const express_1 = require("express");
/**
 * Placeholder history endpoints.
 */
function historyRouter() {
    const router = (0, express_1.Router)();
    router.get("/", (_req, res) => {
        res.status(501).json({ success: false, error: "History endpoint not implemented in this build." });
    });
    return router;
}
