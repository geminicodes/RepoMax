import type { RequestHandler } from "express";
import { HttpError } from "../errors/httpError";
import { getAuth, getFirestore } from "../config/firebase";
import { createOrUpdateUser } from "../services/userService";

function parseBearerToken(header: string | undefined) {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

async function getUserTier(uid: string): Promise<"free" | "pro"> {
  const db = getFirestore();
  const snap = await db.collection("users").doc(uid).get();
  const tier = (snap.exists ? (snap.data()?.tier as string | undefined) : undefined) ?? "free";
  return tier === "pro" ? "pro" : "free";
}

export const authenticateUser: RequestHandler = async (req, _res, next) => {
  try {
    const token = parseBearerToken(req.header("authorization"));
    if (!token) {
      return next(
        new HttpError({
          statusCode: 401,
          publicMessage: "Authentication required.",
          internalMessage: "Missing bearer token"
        })
      );
    }

    const auth = getAuth();
    const decoded = await auth.verifyIdToken(token, true);

    // Ensure user exists/updated in Firestore (server-trusted fields).
    await createOrUpdateUser(
      decoded.uid,
      decoded.email ?? null,
      (decoded as any).name ?? null,
      (decoded as any).picture ?? null
    );

    const tier = await getUserTier(decoded.uid);

    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      tier,
      displayName: (decoded as any).name ?? null,
      photoURL: (decoded as any).picture ?? null
    };

    req.log?.info({ uid: decoded.uid, tier }, "auth_ok");
    next();
  } catch (err) {
    req.log?.warn({ err }, "auth_failed");
    next(
      new HttpError({
        statusCode: 401,
        publicMessage: "Invalid or expired token.",
        internalMessage: "Token verification failed"
      })
    );
  }
};

export const optionalAuth: RequestHandler = async (req, _res, next) => {
  const token = parseBearerToken(req.header("authorization"));
  if (!token) return next();

  try {
    const auth = getAuth();
    const decoded = await auth.verifyIdToken(token, true);

    await createOrUpdateUser(
      decoded.uid,
      decoded.email ?? null,
      (decoded as any).name ?? null,
      (decoded as any).picture ?? null
    );

    const tier = await getUserTier(decoded.uid);
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      tier,
      displayName: (decoded as any).name ?? null,
      photoURL: (decoded as any).picture ?? null
    };

    req.log?.info({ uid: decoded.uid, tier }, "auth_optional_ok");
    next();
  } catch (err) {
    // Silent failure for optional auth
    req.log?.warn({ err }, "auth_optional_failed");
    next();
  }
};

