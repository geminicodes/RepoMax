import { Router } from "express";
import { HttpError } from "../../errors/httpError";
import { authenticateUser } from "../../middleware/auth";
import { getAuth } from "../../config/firebase";

/**
 * Auth utility endpoints.
 *
 * Mounted at `/api/v1/auth`.
 */
export function authRouter() {
  const router = Router();

  /**
   * Revoke all refresh tokens for the current user.
   *
   * This is used by the client "Sign out all devices" action.
   * It does not change the API contract of existing endpoints.
   */
  router.post("/revoke", authenticateUser, async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return next(
          new HttpError({
            statusCode: 401,
            publicMessage: "Authentication required.",
            internalMessage: "Missing req.user after authenticateUser"
          })
        );
      }

      await getAuth().revokeRefreshTokens(user.uid);
      res.json({ success: true, data: { revoked: true } });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

