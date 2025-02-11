import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import UserService from "@src/services/user/UserService.js";
import IterationService from "@src/services/IterationService.js";
import MainMapHubService from "@src/services/main_map/MainMapHubService.js";
import MainMapService from "@src/services/main_map/MainMapService.js";
import PropagatedError from "@src/models/PropagatedError.js";
import UserIslandService from "@src/services/UserIslandService.js";
import UserBeenToHubsService from "@src/services/main_map/UserBeenToHubsService.js";

const router = express.Router();

router.get(
  "/my_island_data",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const userIslandService = new UserIslandService();
    const iterationService = new IterationService();

    // check & create default user island
    let userIsland = await userIslandService.createDefaultUserIsland(user);

    // get active iteration
    const iteration = await iterationService.getCurrentIteration();

    // if there is no active iteration, other operations are pointless
    if (!iteration) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
      );
      return;
    }

    const getUserIslandLocations =
      await iterationService.getUserIslandLocation(userIsland);
    // checking if userIsland is in active iteration, respawning otherwise
    if (!getUserIslandLocations.iteration?.active) {
      await userIslandService.spawnUserIsland(
        userIsland,
        getUserIslandLocations.iteration?.id,
      );
    }

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        userIsland: userIsland.prepareREST(),
      }),
    );
  },
);

export default router;
