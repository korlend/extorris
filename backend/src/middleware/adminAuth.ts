import express, { Request, Response, NextFunction } from "express";

import ConfigLoader from "@src/core/config/ConfigLoader.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const createError = require("http-errors");

import PropagatedError from "@src/models/PropagatedError.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import { AdminSessionModel } from "@src/models/db/index.js";
import AdminService from "@src/services/admin/AdminService.js";
import AdminSessionService from "@src/services/admin/AdminSessionService.js";

const router = express.Router();

router.all(
  "/*wildcard",
  async (req: Request, res: Response, next: NextFunction) => {
    const config = ConfigLoader.getInstance();

    const authRequired: boolean = config?.get("auth.security.authRequired");
    const adminAuthFreeEndpoints: Array<string> =
      config?.get("auth.security.adminAuthFreeEndpoints") || [];
    const adminApiUrlPrefix = config?.get("adminApiUrlPrefix");

    const urlPath = req.path;
    const token = req.headers.authorization?.split(" ")[1];

    if (!authRequired) {
      // next();
      return;
    }

    const sessionService = new AdminSessionService();
    const adminService = new AdminService();

    if (
      adminAuthFreeEndpoints.find((endpoint: string) => urlPath.match(endpoint))
    ) {
      next();
      return;
    }
    if (!token) {
      throw new PropagatedError(ExpressResponseTypes.UNAUTHORIZED);
    }
    const session: AdminSessionModel =
      await sessionService.getSessionByToken(token);
    if (!session || !session.expire || session.expire < new Date()) {
      throw new PropagatedError(ExpressResponseTypes.SESSION_EXPIRED);
    }
    const admin = await adminService.getAdminBySessionToken(session.token);
    if (!admin) {
      throw new PropagatedError(ExpressResponseTypes.FORBIDDEN);
    }

    res.locals.session = session;
    res.locals.admin = admin;
    next();

    // const role = await roleService.getByUser(user)
    // if (!role) {
    //   next(createError(403));
    //   return
    // }
    // const endpoints = role.endpoints.split(',')
    // if (!endpoints.find(v => baseUrl.match(v))) {
    //   next(createError(403));
    //   return
    // }

    // sessionService.extendSession(session)
  },
);

export default router;
