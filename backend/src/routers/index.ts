import express, { Request, Response, NextFunction } from "express";

import adminAuthMiddleware from "@src/middleware/adminAuth.js";
import userAuthMiddleware from "@src/middleware/userAuth.js";
import authenticatedAuthMiddleware from "@src/middleware/authenticatedAuth.js";

import adminAuthRouter from "./admin/adminAuth.js";
import entitiesRouter from "./admin/entities.js";
import mainMapRouter from "./admin/mainMap.js";
import imagesRouter from "./admin/images.js";

import userChatRouter from "./user/chat.js";
import userAuthRouter from "./user/userAuth.js";
import userMainMapRouter from "./user/mainMap.js";
import userShipManagementRouter from "./user/shipManagement.js";
import homeIslandRouter from "./user/homeIsland.js";

import configRouter from "./authenticated/config.js";

import ExpressNext from "@src/models/ExpressNext.js";
import ExpressAPIType from "@src/enums/ExpressAPIType.js";

const adminRouter = express.Router();
const userRouter = express.Router();
const authenticatedRouter = express.Router();

adminRouter.get(
  "/version",
  function (req: Request, res: Response, next: NextFunction) {
    res.status(200).send("1.0.0");
  },
);

adminRouter.use(adminAuthMiddleware);

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/entities", entitiesRouter);
adminRouter.use("/main_map", mainMapRouter);
adminRouter.use("/images", imagesRouter);

// next propagation
// adminRouter.use((prev: ExpressNext, req: Request, res: Response, next: NextFunction) => {
//   next({
//     ...prev,
//     apiType: ExpressAPIType.ADMIN,
//   });
// });

// -----------------------------------------------------------------------------------------------------

userRouter.get(
  "/version",
  function (req: Request, res: Response, next: NextFunction) {
    res.status(200).send("1.0.0");
  },
);

userRouter.use(userAuthMiddleware);

userRouter.use("/chat", userChatRouter);
userRouter.use("/auth", userAuthRouter);
userRouter.use("/main_map", userMainMapRouter);
userRouter.use("/ship", userShipManagementRouter);
userRouter.use("/home_island", homeIslandRouter);

// next propagation
// userRouter.use((prev: ExpressNext, req: Request, res: Response, next: NextFunction) => {
//   next({
//     ...prev,
//     apiType: ExpressAPIType.USER,
//   });
// });

authenticatedRouter.use(authenticatedAuthMiddleware);

authenticatedRouter.use("/config", configRouter);

export { adminRouter, userRouter, authenticatedRouter };
