import { TreeBranchModel } from "@src/models/db/index.js";
import TreeBranchRepository from "@src/repositories/main_map/TreeBranchRepository.js";
import Service from "../Service.js";

export default class TreeBranchService extends Service<
  TreeBranchModel,
  TreeBranchRepository
> {
  constructor() {
    super(new TreeBranchRepository());
  }
}
