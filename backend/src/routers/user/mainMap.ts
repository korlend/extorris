import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import IterationService from "@src/services/IterationService.js";
import MainMapService from "@src/services/main_map/MainMapService.js";
import MainMapHubService from "@src/services/main_map/MainMapHubService.js";
import {
  IterationModel,
  MainMapHubModel,
  MainMapModel,
  PortalModel,
} from "@src/models/db/index.js";
import PortalService from "@src/services/main_map/PortalService.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import DBFilter from "@src/models/DBFilter.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import PropagatedError from "@src/models/PropagatedError.js";
import UserIslandService from "@src/services/UserIslandService.js";
import UserBeenToHubsService from "@src/services/main_map/UserBeenToHubsService.js";
import ShipService from "@src/services/ship/ShipService.js";

const router = express.Router();

router.get(
  "/load_active_iteration",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    const iterationService = new IterationService();
    const mainMapService = new MainMapService();
    const mainMapHubService = new MainMapHubService();
    const portalService = new PortalService();

    const iterationFilters: Array<DBFilter<IterationModel>> = [];
    iterationFilters.push(new DBFilter("active", true, "=", "AND"));
    // for now just using active filter on iteration
    // iterationFilters.push(new DBFilter("start_date", new Date(), "<", "AND"));
    // iterationFilters.push(new DBFilter("end_date", new Date(), ">", "AND"));
    const iteration = await iterationService.getSearchSingle(iterationFilters);
    if (!iteration) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "no active iterations found",
      );
    }
    const mainMaps = await mainMapService.getAllBy(
      "iteration_id",
      iteration.id,
    );
    const userHubs = await mainMapHubService.getUserAvailableHubs(
      user.id,
      mainMaps.map((map) => map.id),
    );
    const portals = await portalService.getHubPortals(
      userHubs.map((hub) => hub.id),
    );

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        iteration: iteration.prepareREST(),
        maps: mainMaps.map((v) => v.prepareREST()),
        hubs: userHubs.map((v) => v.prepareREST()),
        portals: portals.map((v) => v.prepareREST()),
      }),
    );
  },
);

router.get(
  "/load_hub/:hub_id",
  async (req: Request, res: Response, next: NextFunction) => {
    let hubId = parseInt(req.params.hub_id);
    const { user } = res.locals;

    const mainMapHubService = new MainMapHubService();
    const portalService = new PortalService();
    const userIslandService = new UserIslandService();
    const userBeenToHubsService = new UserBeenToHubsService();
    const shipService = new ShipService();

    const isUserBeenToHub = await userBeenToHubsService.isUserBeenToHub(
      user.id,
      hubId,
    );

    // deciding which hub to load
    if (!hubId || !isUserBeenToHub) {
      const userShip = await shipService.getBy("user_id", user.id);
      if (!userShip?.main_map_hub_id) {
        const userIsland = await userIslandService.getBy("user_id", user.id);
        if (!userIsland.main_map_hub_id) {
          next(
            ExpressResponseGenerator.getResponse(
              ExpressResponseTypes.ERROR,
              `User has no ship personal island, should be impossible`,
            ),
          );
          return;
        }
        hubId = userIsland.main_map_hub_id;
      } else {
        hubId = userShip.main_map_hub_id;
      }
    }

    const hub = await mainMapHubService.get(hubId);

    const portals = await portalService.getHubPortals(hub.id);
    const usersIslands = await userIslandService.getUsersIslands(hub);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        hub: hub.prepareREST(),
        portals: portals.map(v => v.prepareREST()),
        usersIslands: usersIslands.map(v => v.prepareREST()),
      }),
    );
  },
);

export default router;
