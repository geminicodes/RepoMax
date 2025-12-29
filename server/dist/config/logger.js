"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
const pino_1 = __importDefault(require("pino"));
/**
 * Create the application logger (JSON logs, production-friendly).
 */
function createLogger() {
    const isProd = process.env.NODE_ENV === "production";
    return (0, pino_1.default)({
        level: process.env.LOG_LEVEL ?? "info",
        base: { service: "readyrepo-server" },
        transport: isProd
            ? undefined
            : {
                target: "pino-pretty",
                options: { colorize: true, translateTime: "SYS:standard" }
            }
    });
}
