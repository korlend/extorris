import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import {
  ShipModel,
  UserModel,
} from "@src/models/db/index.js";
import UserService from "@src/services/user/UserService.js";
import PropagatedError from "@src/models/PropagatedError.js";
import ShipService from "@src/services/ship/ShipService.js";

const router = express.Router();

// router.get('/getAll', async (req: Request, res: Response, next: NextFunction) => {
//   const userRepo = new UserRepository();
//   res.send(await userRepo.getAll());
// });

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService();
    const user = new UserModel().parseObject(req.body);
    const newUser = await userService.register(user);
    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        newUser,
      ),
    );
  },
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const userServices = new UserService();
    const { username, password } = req.body;

    const session = await userServices.login(username, password);
    if (!session.user_id) {
      throw new PropagatedError(ExpressResponseTypes.ERROR);
    }
    const user = await userServices.get(session.user_id);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        session: session.prepareREST(),
        user: user?.prepareREST(),
      }),
    );
  },
);

router.put(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_session } = res.locals;
    if (!user_session) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }
    const userServices = new UserService();
    await userServices.logout(user_session);
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  const { user, user_session } = res.locals;
  if (!user_session || !user) {
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN));
    return;
  }
  const shipService = new ShipService();

  /* START creating default ship for user */
  let userShips = await shipService.getAllBy("user_id", user.id);
  if (!userShips || !userShips.length) {
    const newShip = new ShipModel();
    newShip.user_id = user.id;
    await shipService.create(newShip);
  }
  /* END creating default ship for user */
  next(
    ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
      session: user_session.prepareREST(),
      user: user.prepareREST(),
      userShips: userShips.map((v) => v.prepareREST()),
    }),
  );
});

export default router;
