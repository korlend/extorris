import DungeonIslandModel from "@src/models/db/DungeonIslandModel.js";
import DungeonIslandRepository from "@src/repositories/DungeonIslandRepository.js";
import Service from "./Service.js";

export default class DungeonIslandService extends Service<
  DungeonIslandModel,
  DungeonIslandRepository
> {
  constructor() {
    super(new DungeonIslandRepository());
  }
}
