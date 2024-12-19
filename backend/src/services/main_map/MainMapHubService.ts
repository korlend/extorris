import { MainMapHubModel, MainMapModel } from "@src/models/db/index.js";
import MainMapHubRepository from "@src/repositories/main_map/MainMapHubRepository.js";
import Service from "../Service.js";

export default class MainMapHubService extends Service<
  MainMapHubModel,
  MainMapHubRepository
> {
  sessionRepo = new MainMapHubRepository();

  constructor() {
    super(new MainMapHubRepository());
  }

  async generateHub(mainMap: MainMapModel, layer: number, depth: number, hubNumber: number): Promise<MainMapHubModel> {
    let mainMapHub = new MainMapHubModel();
    mainMapHub.main_map_id = mainMap.id;
    mainMapHub.on_depth = depth;
    mainMapHub.hub_number = hubNumber;
    mainMapHub = await this.create(mainMapHub);
    return mainMapHub;
  }

  // async getUserHubHistory(iterationId: number): Promise<Array<MainMapHubModel>> {
  //   return this.repo.getUserHubHistory(iterationId)
  // }
}
