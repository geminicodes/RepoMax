"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const httpError_1 = require("../errors/httpError");
/**
 * Convert express-validator errors into a single safe 400 response.
 */
const validateRequest = (req, _res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty())
        return next();
    const details = result.array({ onlyFirstError: true }).map((e) => ({
        field: e.type === "field" ? e.path : e.type,
        message: e.msg
    }));
    return next(new httpError_1.HttpError({
        statusCode: 400,
        publicMessage: "Invalid request.",
        internalMessage: "Request validation failed",
        details: { errors: details }
    }));
};
exports.validateRequest = validateRequest;
