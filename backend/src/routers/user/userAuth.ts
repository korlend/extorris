import express, { Request, Response, NextFunction } from "express";
import UserService from "@src/services/UserService.js";
import UserModel from "@src/models/db/UserModel.js";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";

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
  "/login_username",
  async (req: Request, res: Response, next: NextFunction) => {
    const userServices = new UserService();
    const { username, password } = req.body;
    const session = await userServices.login(username, password);
    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        session,
      ),
    );
  },
);

router.get(
  "/login_email",
  async (req: Request, res: Response, next: NextFunction) => {
    const userServices = new UserService();
    const { username, password } = req.body;
    const session = await userServices.loginByEmail(username, password);
    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        session,
      ),
    );
  },
);

router.put(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    const { session } = res.locals;
    const userServices = new UserService();
    await userServices.logout(session);
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

router.get(
  "/me",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, session } = res.locals;
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        session: session.prepareREST(),
        user: user.prepareREST(),
      }),
    );
  },
);

export default router;
