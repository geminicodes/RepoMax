"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTimeout = requestTimeout;
const env_1 = require("../config/env");
/**
 * Enforce a hard timeout for inbound requests.
 */
function requestTimeout() {
    const { REQUEST_TIMEOUT_MS } = (0, env_1.getEnv)();
    return (req, res, next) => {
        req.setTimeout(REQUEST_TIMEOUT_MS);
        res.setTimeout(REQUEST_TIMEOUT_MS);
        next();
    };
}
