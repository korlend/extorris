import express, { Request, Response, NextFunction } from "express";

import ConfigLoader from "@src/core/config/ConfigLoader.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import PropagatedError from "@src/models/PropagatedError.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import { AdminSessionModel, UserSessionModel } from "@src/models/db/index.js";
import AdminService from "@src/services/admin/AdminService.js";
import AdminSessionService from "@src/services/admin/AdminSessionService.js";
import UserService from "@src/services/user/UserService.js";
import UserSessionService from "@src/services/user/UserSessionService.js";

const router = express.Router();

router.all(
  "/*wildcard",
  async (req: Request, res: Response, next: NextFunction) => {
    const config = ConfigLoader.getInstance();

    const authRequired: boolean = config?.get("auth.security.authRequired");

    if (!authRequired) {
      // next();
      return;
    }

    const adminAuthFreeEndpoints: Array<string> =
      config?.get("auth.security.adminAuthFreeEndpoints") || [];
    const userAuthFreeEndpoints: Array<string> =
      config?.get("auth.security.userAuthFreeEndpoints") || [];

    const urlPath = req.path;
    const token = req.headers.authorization?.split(" ")[1];

    const adminSessionService = new AdminSessionService();
    const adminService = new AdminService();
    const userSessionService = new UserSessionService();
    const userService = new UserService();

    if (
      adminAuthFreeEndpoints.find((endpoint: string) =>
        urlPath.match(endpoint),
      ) ||
      userAuthFreeEndpoints.find((endpoint: string) =>
        urlPath.match(`${endpoint}`),
      )
    ) {
      next();
      return;
    }

    if (!token) {
      throw new PropagatedError(ExpressResponseTypes.UNAUTHORIZED);
    }

    const adminSession: AdminSessionModel =
      await adminSessionService.getSessionByToken(token);

    const userSession: UserSessionModel =
      await userSessionService.getSessionByToken(token);

    if (
      adminSession &&
      adminSession.expire &&
      adminSession.expire > new Date()
    ) {
      const admin = await adminService.getAdminBySessionToken(
        adminSession.token,
      );
      if (!admin) {
        throw new PropagatedError(ExpressResponseTypes.FORBIDDEN);
      }

      res.locals.admin_session = adminSession;
      res.locals.admin = admin;
      next();
      return;
    }

    if (userSession && userSession.expire && userSession.expire > new Date()) {
      const user = await userService.getUserBySessionToken(userSession.token);
      if (!user) {
        throw new PropagatedError(ExpressResponseTypes.FORBIDDEN);
      }

      res.locals.user_session = userSession;
      res.locals.user = user;
      next();
      return;
    }

    throw new PropagatedError(ExpressResponseTypes.SESSION_EXPIRED);
  },
);

export default router;
