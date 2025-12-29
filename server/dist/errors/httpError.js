"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    statusCode;
    publicMessage;
    details;
    constructor(params) {
        super(params.internalMessage ?? params.publicMessage);
        this.name = "HttpError";
        this.statusCode = params.statusCode;
        this.publicMessage = params.publicMessage;
        this.details = params.details;
    }
}
exports.HttpError = HttpError;
