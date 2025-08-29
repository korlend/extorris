import ConfigDimensionsModel from "@src/models/db/ConfigDimensionsModel.js";
import ConfigDimensionsRepository from "@src/repositories/ConfigDimensionsRepository.js";
import Service from "./Service.js";

export default class ConfigDimensionsService extends Service<
  ConfigDimensionsModel,
  ConfigDimensionsRepository
> {

  constructor() {
    super(new ConfigDimensionsRepository());
  }
}
