import {
  IterationModel,
  MainMapHubModel,
  MainMapModel,
  UserIslandModel,
} from "@src/models/db/index.js";
import MainMapHubRepository from "@src/repositories/main_map/MainMapHubRepository.js";
import Service from "../Service.js";
import { randomInt } from "crypto";
import DBFilter from "@src/models/DBFilter.js";

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

  async getHub(depth: number, hub: number, mainMapId: number) {
    const filters: Array<DBFilter<MainMapHubModel>> = [];
    filters.push(new DBFilter("on_depth", depth));
    filters.push(new DBFilter("hub_number", hub));
    filters.push(new DBFilter("main_map_id", mainMapId));
    return this.getSearchSingle(filters);
  }

  async getUserIslandLocation(
    userIsland?: UserIslandModel,
  ): Promise<MainMapHubModel | null> {
    if (!userIsland?.main_map_hub_id) return null;
    const hub = await this.get(userIsland.main_map_hub_id);
    return hub;
  }

  // async getUserHubHistory(iterationId: number): Promise<Array<MainMapHubModel>> {
  //   return this.repo.getUserHubHistory(iterationId)
  // }
}
