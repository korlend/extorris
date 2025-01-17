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

const router = express.Router();

router.get(
  "/load_active_iteration",
  async (req: Request, res: Response, next: NextFunction) => {
    const iterationService = new IterationService();
    const mainMapService = new MainMapService();
    const mainMapHubService = new MainMapHubService();
    const portalService = new PortalService();

    const response: {
      iteration?: IterationModel;
      mainMaps: Array<{
        mainMap: MainMapModel;
        hubs: Array<MainMapHubModel>;
      }>;
      portals: Array<PortalModel>;
    } = {
      mainMaps: [],
      portals: [],
    };
    const iterationRequestData = new SearchRequestData(0, 1, "updated", "DESC");
    const iterationFilters: Array<DBFilter<IterationModel>> = [];
    iterationFilters.push(new DBFilter("active", true, "=", "AND"));
    iterationFilters.push(new DBFilter("start_date", new Date(), "<", "AND"));
    iterationFilters.push(new DBFilter("end_date", new Date(), ">", "AND"));
    const iterations = await iterationService.getSearchAll(iterationRequestData, undefined, iterationFilters);
    if (!iterations.items) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "no active iterations found");
    }
    const iteration = iterations.items[0];
    // const userHubs
    const mainMaps = await mainMapService.getAllBy(
      "iteration_id",
      iteration.id,
    );

    response.iteration = iteration;
    const portalFilters: Array<DBFilter<PortalModel>> = [];

    for (let i = 0; i < mainMaps.length; i++) {
      const map = mainMaps[i];
      const mapHubs = await mainMapHubService.getAllBy("main_map_id", map.id);
      response.mainMaps.push({
        mainMap: map,
        hubs: mapHubs,
      });
      for (let j = 0; j < mapHubs.length; j++) {
        const hub = mapHubs[j];
        portalFilters.push(new DBFilter("from_hub_id", hub.id, "=", "OR"));
        portalFilters.push(new DBFilter("to_hub_id", hub.id, "=", "OR"));
      }
    }

    response.portals = await portalService.getAll(
      0,
      10000,
      new ParametersLimit(),
      portalFilters,
    );

    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        response,
      ),
    );
  },
);

router.get(
  "/load_hub/:hub_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const iterationService = new IterationService();
    const mainMapService = new MainMapService();
    const mainMapHubService = new MainMapHubService();
    const portalService = new PortalService();

    const hubId = parseInt(req.params.hub_id);

    const hub = await mainMapHubService.get(hubId);

    const portals = await portalService.getAllBy("from_hub_id", hubId);

    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        {
          hub,
          portals,
        },
      ),
    );
  },
);



export default router;
