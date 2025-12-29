"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const httpError_1 = require("../errors/httpError");
/**
 * Centralized error handler: logs server-side, returns safe client message.
 */
const errorHandler = (err, req, res, _next) => {
    const log = req.log ?? console;
    const requestId = req.headers["x-request-id"] ?? undefined;
    const isHttpError = err instanceof httpError_1.HttpError;
    const statusCode = isHttpError ? err.statusCode : 500;
    const publicMessage = isHttpError ? err.publicMessage : "Unexpected server error.";
    log.error({
        err,
        statusCode,
        requestId,
        path: req.path,
        method: req.method
    }, "request_failed");
    res.status(statusCode).json({
        success: false,
        error: publicMessage
    });
};
exports.errorHandler = errorHandler;
