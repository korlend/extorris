import { TreeModel } from "@src/models/db/index.js";
import TreeRepository from "@src/repositories/main_map/TreeRepository.js";
import Service from "../Service.js";

export default class TreeService extends Service<
  TreeModel,
  TreeRepository
> {
  constructor() {
    super(new TreeRepository());
  }
}
