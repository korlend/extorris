import {
  IterationModel,
  MainMapHubModel,
  MainMapModel,
  PortalModel,
} from "@src/models/db/index.js";
import MainMapRepository from "@src/repositories/main_map/MainMapRepository.js";
import Service from "../Service.js";
import HexagonHelper from "@src/core/computation/HexagonHelper.js";
import MainMapHubService from "./MainMapHubService.js";
import HexagonLinked from "@src/models/HexagonLinked.js";
import PortalService from "./PortalService.js";
import Randomizer from "@src/core/computation/Randomizer.js";

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
  ): Promise<MainMapModel> {
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
      const maxHubNumber = HexagonHelper.getDepthItemMaxNumber(currentDepth);
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

    const coordinatesFunctions = [
      HexagonHelper.getHexCoordinatesTopLeft,
      HexagonHelper.getHexCoordinatesTopRight,
      HexagonHelper.getHexCoordinatesRight,
      HexagonHelper.getHexCoordinatesBottomRight,
      HexagonHelper.getHexCoordinatesBottomLeft,
      HexagonHelper.getHexCoordinatesLeft,
    ];

    const portalPositions: Array<{ x: number; y: number }> = [
      { x: -4000, y: 4000 },
      { x: 4000, y: 4000 },
      { x: 0, y: 6000 },
      { x: 4000, y: -4000 },
      { x: -4000, y: -4000 },
      { x: 0, y: -6000 },
    ];

    // creating portals, simple links
    const portals: Record<string, PortalModel> = {};
    for (let currentDepth = 0; currentDepth < mapDepth; currentDepth++) {
      const maxHubNumber = HexagonHelper.getDepthItemMaxNumber(currentDepth);
      for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {
        for (let i = 0; i < coordinatesFunctions.length; i++) {
          const checks = Randomizer.randomCheck(1, 10);
          if (checks) {
            const toHubCoords = coordinatesFunctions[i](
              currentDepth,
              hubNumber,
            );

            // check if portal already exists between two hubs
            if (
              toHubCoords.itemDepth >= mapDepth ||
              portals[
                `${currentDepth}-${hubNumber}:${toHubCoords.itemDepth}-${toHubCoords.itemNumber}`
              ]
            ) {
              continue;
            }

            let portal = new PortalModel();
            portal.from_hub_id = hubsMap[`${currentDepth}-${hubNumber}`].id;
            portal.to_hub_id =
              hubsMap[`${toHubCoords.itemDepth}-${toHubCoords.itemNumber}`].id;

            const fromPositions = portalPositions[i];
            const toPositions = portalPositions[(i + 3) % 6];

            portal.from_hub_position_x = fromPositions.x;
            portal.from_hub_position_y = fromPositions.y;
            portal.to_hub_position_x = toPositions.x;
            portal.to_hub_position_y = toPositions.y;

            portal = await portalsService.create(portal);
            portals[
              `${currentDepth}-${hubNumber}:${toHubCoords.itemDepth}-${toHubCoords.itemNumber}`
            ] = portal;
            portals[
              `${toHubCoords.itemDepth}-${toHubCoords.itemNumber}:${currentDepth}-${hubNumber}`
            ] = portal;
          }
        }
      }
    }

    return mainMap;
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
      HexagonHelper.getHexCoordinatesTopLeft(0, 0),
      HexagonHelper.getHexCoordinatesTopRight(0, 0),
      HexagonHelper.getHexCoordinatesRight(0, 0),
      HexagonHelper.getHexCoordinatesBottomRight(0, 0),
      HexagonHelper.getHexCoordinatesBottomLeft(0, 0),
      HexagonHelper.getHexCoordinatesLeft(0, 0),
    );

    for (let currentDepth = 1; currentDepth < maxDepth; currentDepth++) {
      const maxHubNumber = HexagonHelper.getDepthItemMaxNumber(currentDepth);
      for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {}
    }

    return hexagonLinked;
  }
}
