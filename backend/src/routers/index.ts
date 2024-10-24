import express, { Request, Response, NextFunction } from "express";

import adminAuthMiddleware from "@src/middleware/adminAuth.js";
import userAuthMiddleware from "@src/middleware/userAuth.js";

import adminAuthRouter from "./admin/adminAuth.js";
import entitiesRouter from "./admin/entities.js";

import userAuthRouter from "./user/userAuth.js";

import ExpressNext from "@src/models/ExpressNext.js";
import ExpressAPIType from "@src/enums/ExpressAPIType.js";

const adminRouter = express.Router();
const userRouter = express.Router();

adminRouter.get(
  "/version",
  function (req: Request, res: Response, next: NextFunction) {
    res.status(200).send("1.0.0");
  },
);

adminRouter.use(adminAuthMiddleware)

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/entities", entitiesRouter);

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

userRouter.use("/auth", userAuthRouter);

// next propagation
// userRouter.use((prev: ExpressNext, req: Request, res: Response, next: NextFunction) => {
//   next({
//     ...prev,
//     apiType: ExpressAPIType.USER,
//   });
// });

export { adminRouter, userRouter };
