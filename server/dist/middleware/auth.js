"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateUser = void 0;
const httpError_1 = require("../errors/httpError");
const firebase_1 = require("../config/firebase");
const userService_1 = require("../services/userService");
function parseBearerToken(header) {
    if (!header)
        return null;
    const [scheme, token] = header.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token)
        return null;
    return token.trim();
}
async function getUserTier(uid) {
    const db = (0, firebase_1.getFirestore)();
    const snap = await db.collection("users").doc(uid).get();
    const tier = (snap.exists ? snap.data()?.tier : undefined) ?? "free";
    return tier === "pro" ? "pro" : "free";
}
const authenticateUser = async (req, _res, next) => {
    try {
        const token = parseBearerToken(req.header("authorization"));
        if (!token) {
            return next(new httpError_1.HttpError({
                statusCode: 401,
                publicMessage: "Authentication required.",
                internalMessage: "Missing bearer token"
            }));
        }
        const auth = (0, firebase_1.getAuth)();
        const decoded = await auth.verifyIdToken(token, true);
        // Ensure user exists/updated in Firestore (server-trusted fields).
        await (0, userService_1.createOrUpdateUser)(decoded.uid, decoded.email ?? null, decoded.name ?? null, decoded.picture ?? null);
        const tier = await getUserTier(decoded.uid);
        req.user = {
            uid: decoded.uid,
            email: decoded.email ?? null,
            tier,
            displayName: decoded.name ?? null,
            photoURL: decoded.picture ?? null
        };
        req.log?.info({ uid: decoded.uid, tier }, "auth_ok");
        next();
    }
    catch (err) {
        req.log?.warn({ err }, "auth_failed");
        next(new httpError_1.HttpError({
            statusCode: 401,
            publicMessage: "Invalid or expired token.",
            internalMessage: "Token verification failed"
        }));
    }
};
exports.authenticateUser = authenticateUser;
const optionalAuth = async (req, _res, next) => {
    const token = parseBearerToken(req.header("authorization"));
    if (!token)
        return next();
    try {
        const auth = (0, firebase_1.getAuth)();
        const decoded = await auth.verifyIdToken(token, true);
        await (0, userService_1.createOrUpdateUser)(decoded.uid, decoded.email ?? null, decoded.name ?? null, decoded.picture ?? null);
        const tier = await getUserTier(decoded.uid);
        req.user = {
            uid: decoded.uid,
            email: decoded.email ?? null,
            tier,
            displayName: decoded.name ?? null,
            photoURL: decoded.picture ?? null
        };
        req.log?.info({ uid: decoded.uid, tier }, "auth_optional_ok");
        next();
    }
    catch (err) {
        // Silent failure for optional auth
        req.log?.warn({ err }, "auth_optional_failed");
        next();
    }
};
exports.optionalAuth = optionalAuth;
