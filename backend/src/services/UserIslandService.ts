import UserIslandModel from "@src/models/db/UserIslandModel.js";
import UserIslandRepository from "@src/repositories/UserIslandRepository.js";
import Service from "./Service.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import PropagatedError from "@src/models/PropagatedError.js";
import MainMapHubService from "./main_map/MainMapHubService.js";
import MainMapService from "./main_map/MainMapService.js";
import UserBeenToHubsService from "./main_map/UserBeenToHubsService.js";
import { UserModel } from "@src/models/db/index.js";

export default class UserIslandService extends Service<
  UserIslandModel,
  UserIslandRepository
> {
  constructor() {
    super(new UserIslandRepository());
  }

  async createDefaultUserIsland(user: UserModel): Promise<UserIslandModel> {
    let userIsland = await this.getBy("user_id", user.id);

    if (!userIsland) {
      const newUserIsland = new UserIslandModel();
      newUserIsland.user_id = user.id;
      userIsland = await this.create(newUserIsland);
    }

    return userIsland;
  }

  async spawnUserIsland(userIsland: UserIslandModel, iterationId?: number) {
    const userBeenToHubsService = new UserBeenToHubsService();
    const mainMapService = new MainMapService();
    const mainMapHubService = new MainMapHubService();
    const spawnMainMap = await mainMapService.getActiveLayer(
      userIsland.layer,
      iterationId,
    );
    if (!spawnMainMap)
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "can't find a map to spawn user island",
      );
    const randomHub =
      await mainMapHubService.getRandomUserIslandSpawnPoint(spawnMainMap);
    userIsland.main_map_hub_id = randomHub.id;
    userIsland.layer = spawnMainMap.layer;
    userIsland = await this.update(userIsland);
    await userBeenToHubsService.addUserBeenToHub(
      userIsland.user_id,
      randomHub.id,
    );
  }
}
