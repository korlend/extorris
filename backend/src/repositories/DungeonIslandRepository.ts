import { DungeonIslandModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class DungeonIslandRepository extends Repository<DungeonIslandModel> {
  constructor() {
    super(new DungeonIslandModel());
  }
}
