import { TreeBranchModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class TreeBranchRepository extends Repository<TreeBranchModel> {
  constructor() {
    super(new TreeBranchModel());
  }
}
