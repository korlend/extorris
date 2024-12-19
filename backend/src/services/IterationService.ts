import IterationModel from "@src/models/db/IterationModel.js";
import IterationRepository from "@src/repositories/IterationRepository.js";
import Service from "./Service.js";
import MainMapService from "./main_map/MainMapService.js";
import { MainMapModel } from "@src/models/db/index.js";
import HexagonHelper from "@src/core/computation/HexagonHelper.js";
import DateUtils from "@src/core/utils/DateUtils.js";

export default class IterationService extends Service<
  IterationModel,
  IterationRepository
> {
  sessionRepo = new IterationRepository();

  constructor() {
    super(new IterationRepository());
  }

  async generateIteration(layerAmount: number, mapDepth: number, treesDepthStart: number = 10, startDate?: Date, endDate?: Date) {
    const mainMapService = new MainMapService();

    if (treesDepthStart === null || treesDepthStart === undefined) {
      treesDepthStart = 10;
    }

    let iteration = new IterationModel();
    if (!startDate) {
      startDate = DateUtils.getBeginningOfNextMonth();
    }
    if (!endDate) {
      endDate = DateUtils.getBeginningOfNextMonth(startDate);
    }
    iteration.start_date = startDate;
    iteration.end_date = endDate;
    iteration = await this.create(iteration);

    // generating trees
    for (let currentDepth = treesDepthStart; currentDepth < mapDepth; currentDepth++) {
      const maxHubNumber = HexagonHelper.getDepthItemMaxNumber(currentDepth);
      for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {
      }
    }

    // generating maps
    const maps: Array<MainMapModel> = [];
    for (let layer = 0; layer < layerAmount; layer++) {
      const newMainMap = await mainMapService.generateNewMap(iteration, layer, mapDepth);
      maps.push(newMainMap);
    }
    return maps;
  }
}
