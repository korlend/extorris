import { MainMapHubModel, MainMapModel } from "@src/models/db/index.js";
import MainMapHubRepository from "@src/repositories/main_map/MainMapHubRepository.js";
import Service from "../Service.js";
import { randomInt } from "crypto";
import DBFilter from "@src/models/DBFilter.js";

export default class MainMapHubService extends Service<
  MainMapHubModel,
  MainMapHubRepository
> {
  sessionRepo = new MainMapHubRepository();

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

  async getRandomUserIslandSpawnPoint(): Promise<MainMapHubModel> {
    const maxDepth = 10;
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
    return await this.getHub(result.depth, result.hub);
  }

  async getHub(depth: number, hub: number) {
    const filters: Array<DBFilter<MainMapHubModel>> = [];
    filters.push(new DBFilter("on_depth", depth));
    filters.push(new DBFilter("hub_number", hub));
    return this.getSearchSingle(filters);
  }

  // async getUserHubHistory(iterationId: number): Promise<Array<MainMapHubModel>> {
  //   return this.repo.getUserHubHistory(iterationId)
  // }
}
