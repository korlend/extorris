import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import UserService from "@src/services/user/UserService.js";

const router = express.Router();

router.get(
  "/my_island_data",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    const userService = new UserService();
    await userService.createDefaultUserIsland(user);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        // userShip: userShip.prepareREST(),
        // userShipParts: userShipParts.map((v) => v.prepareREST()),
        // equippedShipParts: equippedShipParts.map((v) => v.prepareREST()),
        // existingShipParts: existingShipParts.items.map((v) => v.prepareREST()),
        // shipPartSubtypes: preparedShipPartSubtypes,
      }),
    );
  },
);

export default router;
