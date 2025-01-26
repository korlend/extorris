import {
  IterationModel,
  MainMapHubModel,
  MainMapModel,
  PortalModel,
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
  getHexNearbyCoords,
  getHexesDirection,
  getReverseDirection,
  HexDirection,
  randomCheck,
  randomInt,
} from "extorris";
import HexagonClusterSolver from "@src/core/computation/HexagonClusterSolver.js";

export default class MainMapService extends Service<
  MainMapModel,
  MainMapRepository
> {
  sessionRepo = new MainMapRepository();

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
}
