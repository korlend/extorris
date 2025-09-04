import ConfigDimensionsModel from "@src/models/db/ConfigDimensionsModel.js";
import ConfigDimensionsRepository from "@src/repositories/ConfigDimensionsRepository.js";
import Service from "./Service.js";
import RedisConnector from "@src/core/RedisConnector.js";
import ServiceOperations from "@src/enums/ServiceOperations.js";

export default class ConfigDimensionsService extends Service<
  ConfigDimensionsModel,
  ConfigDimensionsRepository
> {
  preOperationCallbacks = {
    [ServiceOperations.CREATE]: async (
      data: ConfigDimensionsModel | Array<ConfigDimensionsModel>,
    ) => {
      const redisConnector = await RedisConnector.getInstance();
      redisConnector.writeConfigDimensions(data);
    },
    [ServiceOperations.UPDATE]: async (
      data: ConfigDimensionsModel | Array<ConfigDimensionsModel>,
    ) => {
      const redisConnector = await RedisConnector.getInstance();
      redisConnector.writeConfigDimensions(data);
    },
    [ServiceOperations.DELETE]: null,
  };

  constructor() {
    super(new ConfigDimensionsRepository());
  }
}
