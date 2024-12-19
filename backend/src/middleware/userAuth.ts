import express, { Request, Response, NextFunction } from "express";

import ConfigLoader from "@src/core/config/ConfigLoader.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const createError = require("http-errors");

import PropagatedError from "@src/models/PropagatedError.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import { UserSessionModel } from "@src/models/db/index.js";
import UserService from "@src/services/user/UserService.js";
import UserSessionService from "@src/services/user/UserSessionService.js";

const router = express.Router();

router.all(
  "/*wildcard",
  async (req: Request, res: Response, next: NextFunction) => {
    const config = ConfigLoader.getInstance();

    const authRequired: boolean = config?.get("auth.security.authRequired");
    const userAuthFreeEndpoints: Array<string> =
      config?.get("auth.security.userAuthFreeEndpoints") || [];

    const urlPath = req.path;
    const token = req.headers.authorization?.split(" ")[1];

    if (!authRequired) {
      next();
      return;
    }

    const sessionService = new UserSessionService();
    const userService = new UserService();

    if (
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
    const session: UserSessionModel =
      await sessionService.getSessionByToken(token);
    if (!session || !session.expire || session.expire < new Date()) {
      throw new PropagatedError(ExpressResponseTypes.SESSION_EXPIRED);
    }
    const user = await userService.getUserBySessionToken(session.token);
    if (!user) {
      throw new PropagatedError(ExpressResponseTypes.FORBIDDEN);
    }

    res.locals.session = session;
    res.locals.user = user;
    next();
  },
);

export default router;
