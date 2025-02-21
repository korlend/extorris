import {
  IterationModel,
  MainMapHubModel,
  MainMapModel,
  UserIslandModel,
  UserModel,
} from "@src/models/db/index.js";
import MainMapHubRepository from "@src/repositories/main_map/MainMapHubRepository.js";
import Service from "../Service.js";
import { randomInt } from "crypto";
import DBFilter from "@src/models/DBFilter.js";
import RedisConnector from "@src/core/RedisConnector.js";
import ShipService from "../ship/ShipService.js";
import UserIslandService from "../UserIslandService.js";
import PortalService from "./PortalService.js";

export default class MainMapHubService extends Service<
  MainMapHubModel,
  MainMapHubRepository
> {
  constructor() {
    super(new MainMapHubRepository());
  }

  async generateHub(
    mainMap: MainMapModel,
    layer: number,
    depth: number,
    hubNumber: number,
  ): Promise<MainMapHubModel> {
    let mainMapHub = new MainMapHubModel();
    mainMapHub.main_map_id = mainMap.id;
    mainMapHub.on_depth = depth;
    mainMapHub.hub_number = hubNumber;
    mainMapHub = await this.create(mainMapHub);
    return mainMapHub;
  }

  async writeActiveHubToRedis(hubId: number) {
    const redisConnector = await RedisConnector.getInstance();

    if (!redisConnector) {
      return;
    }

    const shipService = new ShipService();
    const portalService = new PortalService();
    const userIslandService = new UserIslandService();
    const hub = await this.get(hubId);

    const portals = await portalService.getHubPortals(hub.id);
    const userIslands = await userIslandService.getAllBy(
      "main_map_hub_id",
      hub.id,
    );
    const hubShips = await shipService.getAllBy("main_map_hub_id", hub.id);
    await redisConnector.writeActiveHub(
      hub,
      portals,
      userIslands,
      hubShips.map((v) => v.id),
    );
  }

  async getRandomUserIslandSpawnPoint(
    mainMap: MainMapModel,
  ): Promise<MainMapHubModel> {
    const maxDepth = mainMap.map_depth;
    const depthsHubsArray = [];
    for (let depth = 0; depth <= maxDepth; depth++) {
      for (let hub = 0; hub < depth * 6; hub++) {
        depthsHubsArray.push({
          depth,
          hub,
        });
      }
    }
    const randomHubNumber = randomInt(depthsHubsArray.length);
    const result = depthsHubsArray[randomHubNumber];
    return await this.getHub(result.depth, result.hub, mainMap.id);
  }

  async getHub(
    depth: number,
    hubId: number,
    mainMapId: number,
  ): Promise<MainMapHubModel> {
    const filters: Array<DBFilter<MainMapHubModel>> = [];
    filters.push(new DBFilter("on_depth", depth));
    filters.push(new DBFilter("hub_number", hubId));
    filters.push(new DBFilter("main_map_id", mainMapId));
    const hub = await this.getSearchSingle(filters);
    return hub;
  }

  async getUserIslandLocation(
    userIsland?: UserIslandModel,
  ): Promise<MainMapHubModel | null> {
    if (!userIsland?.main_map_hub_id) return null;
    const hub = await this.get(userIsland.main_map_hub_id);
    return hub;
  }

  async getUserAvailableHubs(
    userId: number,
    mapIds: number,
  ): Promise<Array<MainMapHubModel>>;
  async getUserAvailableHubs(
    userId: number,
    mapId: number,
  ): Promise<Array<MainMapHubModel>>;
  async getUserAvailableHubs(
    userId: number,
    mapIds: number | Array<number>,
  ): Promise<Array<MainMapHubModel>>;
  async getUserAvailableHubs(
    userId: number,
    mapIds: number | Array<number>,
  ): Promise<Array<MainMapHubModel>> {
    const hubs = await this.repo.getUserHubHistory(userId, mapIds);
    return hubs;
  }

  // async getUserHubHistory(iterationId: number): Promise<Array<MainMapHubModel>> {
  //   return this.repo.getUserHubHistory(iterationId)
  // }
}
