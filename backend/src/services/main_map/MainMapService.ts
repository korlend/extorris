import {
  IterationModel,
  MainMapHubModel,
  MainMapModel,
  PortalModel,
  UserIslandModel,
} from "@src/models/db/index.js";
import MainMapRepository from "@src/repositories/main_map/MainMapRepository.js";
import Service from "../Service.js";
import MainMapHubService from "./MainMapHubService.js";
import HexagonLinked from "@src/models/HexagonLinked.js";
import PortalService from "./PortalService.js";
import {
  getDepthItemMaxNumber,
  getHexCoordinatesBottomLeft,
  getHexCoordinatesBottomRight,
  getHexCoordinatesLeft,
  getHexCoordinatesRight,
  getHexCoordinatesTopLeft,
  getHexCoordinatesTopRight,
} from "extorris-common";
import HexagonClusterSolver from "@src/core/computation/HexagonClusterSolver.js";
import DBFilter from "@src/models/DBFilter.js";
import IterationService from "../IterationService.js";

export default class MainMapService extends Service<
  MainMapModel,
  MainMapRepository
> {
  constructor() {
    super(new MainMapRepository());
  }

  public async generateNewMap(
    iteration: IterationModel,
    layer: number,
    mapDepth: number,
  ): Promise<{
    map: MainMapModel;
    hubs: Array<MainMapHubModel>;
    portals: Array<PortalModel>;
  }> {
    const mainMapHubService = new MainMapHubService();
    const portalsService = new PortalService();

    let mainMap = new MainMapModel();
    mainMap.layer = layer;
    mainMap.map_depth = mapDepth;
    mainMap.iteration_id = iteration.id;
    mainMap = await this.create(mainMap);

    // generating hubs
    const hubs: Array<MainMapHubModel> = [];
    const hubsMap: Record<string, MainMapHubModel> = {};
    for (let currentDepth = 0; currentDepth < mapDepth; currentDepth++) {
      const maxHubNumber = getDepthItemMaxNumber(currentDepth);
      for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {
        const hub = await mainMapHubService.generateHub(
          mainMap,
          layer,
          currentDepth,
          hubNumber,
        );
        hubs.push(hub);
        hubsMap[`${currentDepth}-${hubNumber}`] = hub;
      }
    }

    const clusterSolver = new HexagonClusterSolver(hubs);

    let portals = clusterSolver.generateSimplePortals();

    portals = await portalsService.createAll(portals);

    // creating hubs clusters
    // const clusters =

    // linking hubs clusters

    return {
      map: mainMap,
      hubs,
      portals,
    };
  }

  public async getHexagonLinkedTree(
    mainMap: MainMapModel,
  ): Promise<HexagonLinked> {
    const mainMapHubService = new MainMapHubService();
    const maxDepth = mainMap.map_depth;
    const hubs: Array<MainMapHubModel> = await mainMapHubService.getAllBy(
      "main_map_id",
      mainMap.id,
    );
    const hubsMap: Record<string, MainMapHubModel> = {};
    for (let i = 0; i < hubs.length; i++) {
      const hub = hubs[i];
      hubsMap[`${hub.on_depth}-${hub.hub_number}`] = hub;
    }

    const hexagonLinked: HexagonLinked = new HexagonLinked(
      hubsMap[`0-0`],
      getHexCoordinatesTopLeft(0, 0),
      getHexCoordinatesTopRight(0, 0),
      getHexCoordinatesRight(0, 0),
      getHexCoordinatesBottomRight(0, 0),
      getHexCoordinatesBottomLeft(0, 0),
      getHexCoordinatesLeft(0, 0),
    );

    for (let currentDepth = 1; currentDepth < maxDepth; currentDepth++) {
      const maxHubNumber = getDepthItemMaxNumber(currentDepth);
      for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {}
    }

    return hexagonLinked;
  }

  async getUserIslandLocation(
    userIsland: UserIslandModel,
  ): Promise<{ map: MainMapModel | null; hub: MainMapHubModel | null }> {
    const mainMapHubService = new MainMapHubService();
    if (!userIsland?.main_map_hub_id) {
      return {
        map: null,
        hub: null,
      };
    }
    const hub = await mainMapHubService.get(userIsland.main_map_hub_id);

    if (!hub?.main_map_id) {
      return {
        map: null,
        hub: hub,
      };
    }
    const map = await this.get(hub?.main_map_id);

    return {
      map,
      hub,
    };
  }

  async getActiveLayer(
    layer: number,
    iterationId?: number,
  ): Promise<MainMapModel | null> {
    const iterationService = new IterationService();
    let iteration: IterationModel | null = null;
    if (iterationId) {
      iteration = await iterationService.get(iterationId);
    }
    if (!iteration || !iteration.active) {
      iteration = await iterationService.getCurrentIteration();
    }
    if (!iteration) return null;
    const filters: Array<DBFilter<MainMapModel>> = [];
    filters.push(new DBFilter("layer", layer));
    filters.push(new DBFilter("iteration_id", iteration.id));
    const mainMap = await this.getSearchSingle(filters);
    return mainMap;
  }
}
