import { TreeModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class TreeRepository extends Repository<TreeModel> {
  constructor() {
    super(new TreeModel());
  }
}
