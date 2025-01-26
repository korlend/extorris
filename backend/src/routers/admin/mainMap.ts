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

const router = express.Router();

router.post(
  "/generate_iteration",
  async (req: Request, res: Response, next: NextFunction) => {
    const iterationService = new IterationService();

    const { layerAmount, mapDepth, treesDepthStart, startDate, endDate } =
      req.body;

    const iteration = await iterationService.generateIteration(
      layerAmount,
      mapDepth,
      treesDepthStart,
      new Date(startDate),
      new Date(endDate),
    );

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        iteration: iteration.prepareREST(),
      }),
    );
  },
);

router.get(
  "/load_iteration/:iteration_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const iterationService = new IterationService();
    const mainMapService = new MainMapService();
    const mainMapHubService = new MainMapHubService();
    const portalService = new PortalService();

    const iterationId = parseInt(req.params.iteration_id);

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

    const iteration = await iterationService.get(iterationId);
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
  "/load_main_map/:main_map_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const mainMapService = new MainMapService();
    const mainMapHubService = new MainMapHubService();
    const portalService = new PortalService();

    const mainMapId = parseInt(req.params.main_map_id);

    const response: {
      mainMap?: MainMapModel;
      mainMapHubs: Array<MainMapHubModel>;
      portals: Array<PortalModel>;
    } = {
      mainMapHubs: [],
      portals: [],
    };

    const mainMap = await mainMapService.get(mainMapId);
    const mainMapHubs = await mainMapHubService.getAllBy(
      "main_map_id",
      mainMap.id,
    );

    response.mainMap = mainMap;
    response.mainMapHubs = mainMapHubs;

    const portalFilters: Array<DBFilter<PortalModel>> = [];

    for (let j = 0; j < mainMapHubs.length; j++) {
      const hub = mainMapHubs[j];
      portalFilters.push(new DBFilter("from_hub_id", hub.id, "=", "OR"));
      portalFilters.push(new DBFilter("to_hub_id", hub.id, "=", "OR"));
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
        {
          mainMap: response.mainMap.prepareREST(),
          mainMapHubs: response.mainMapHubs.map(v => v.prepareREST()),
          portals: response.portals.map(v => v.prepareREST()),
        },
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
