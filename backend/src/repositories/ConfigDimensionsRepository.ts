import { ConfigDimensionsModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class ConfigDimensionsRepository extends Repository<ConfigDimensionsModel> {
  constructor() {
    super(new ConfigDimensionsModel());
  }
}
