import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import AdminService from "@src/services/admin/AdminService.js";
import PropagatedError from "@src/models/PropagatedError.js";

const router = express.Router();

router.post(
  "/login_username",
  async (req: Request, res: Response, next: NextFunction) => {
    const adminServices = new AdminService();
    const { username, password } = req.body;
    const session = await adminServices.login(username, password);
    if (!session.admin_id) {
      throw new PropagatedError(ExpressResponseTypes.ERROR);
    }
    const admin = await adminServices.get(session.admin_id);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        session: session.prepareREST(),
        admin: admin.prepareREST(),
      }),
    );
  },
);

router.post(
  "/login_email",
  async (req: Request, res: Response, next: NextFunction) => {
    const adminServices = new AdminService();
    const { email, password } = req.body;
    const session = await adminServices.loginByEmail(email, password);
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
    const adminServices = new AdminService();
    await adminServices.logout(session);
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  const { admin, session } = res.locals;
  next(
    ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
      session: session.prepareREST(),
      admin: admin.prepareREST(),
    }),
  );
});

export default router;
