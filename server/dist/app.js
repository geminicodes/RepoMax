"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const requestTimeout_1 = require("./middleware/requestTimeout");
const routes_1 = require("./routes");
/**
 * Create the Express application with production-ready middleware order.
 */
function createApp() {
    const env = (0, env_1.getEnv)();
    const logger = (0, logger_1.createLogger)();
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.set("logger", logger);
    app.use((0, pino_http_1.default)({ logger }));
    app.use((0, requestTimeout_1.requestTimeout)());
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            const allowed = [env.CLIENT_ORIGIN];
            if (allowed.includes(origin))
                return cb(null, true);
            return cb(new Error("CORS blocked"), false);
        },
        credentials: true
    }));
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60_000,
        limit: 120,
        standardHeaders: "draft-7",
        legacyHeaders: false
    }));
    app.use("/api", (0, routes_1.apiRouter)());
    app.use(errorHandler_1.errorHandler);
    return app;
}
