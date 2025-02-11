import IterationModel from "@src/models/db/IterationModel.js";
import IterationRepository from "@src/repositories/IterationRepository.js";
import Service from "./Service.js";
import MainMapService from "./main_map/MainMapService.js";
import {
  MainMapHubModel,
  MainMapModel,
  PortalModel,
  UserIslandModel,
} from "@src/models/db/index.js";
import DateUtils from "@src/core/utils/DateUtils.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import MainMapHubService from "./main_map/MainMapHubService.js";
import PortalService from "./main_map/PortalService.js";
import { getDepthItemMaxNumber } from "extorris-common";

export default class IterationService extends Service<
  IterationModel,
  IterationRepository
> {
  constructor() {
    super(new IterationRepository());
  }

  async generateIteration(
    layerAmount: number,
    mapDepth: number,
    treesDepthStart: number = 10,
    startDate?: Date,
    endDate?: Date,
  ): Promise<IterationModel> {
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
    for (
      let currentDepth = treesDepthStart;
      currentDepth < mapDepth;
      currentDepth++
    ) {
      const maxHubNumber = getDepthItemMaxNumber(currentDepth);
      for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {}
    }

    // generating maps
    const maps: Array<MainMapModel> = [];
    for (let layer = 0; layer < layerAmount; layer++) {
      const { map } = await mainMapService.generateNewMap(
        iteration,
        layer,
        mapDepth,
      );
      maps.push(map);
    }
    return iteration;
  }

  async getUserIslandLocation(userIsland: UserIslandModel): Promise<{
    iteration: IterationModel | null;
    map: MainMapModel | null;
    hub: MainMapHubModel | null;
  }> {
    const mainMapService = new MainMapService();
    const { map, hub } = await mainMapService.getUserIslandLocation(userIsland);
    if (!map?.iteration_id) {
      return {
        hub,
        map,
        iteration: null,
      };
    }
    const iteration = await this.get(map?.iteration_id);
    return {
      hub,
      map,
      iteration,
    };
  }

  getCurrentIteration(): Promise<IterationModel | null> {
    return this.getBy("active", true);
  }

  async delete(model: IterationModel): Promise<void>;
  async delete(id: number): Promise<void>;
  async delete(data: number | IterationModel): Promise<void> {
    if (data instanceof IterationModel) {
      data = data.id;
    }

    const mainMapService = new MainMapService();
    const mainMapHubService = new MainMapHubService();
    const portalService = new PortalService();

    const iteration = await this.get(data);

    const mainMaps = await mainMapService.getAllBy(
      "iteration_id",
      iteration?.id,
      new ParametersLimit<MainMapModel>([], ["id", "iteration_id"]),
    );

    const allMainMapsHubs = [];
    for (let i = 0; i < mainMaps.length; i++) {
      const mainMap = mainMaps[i];
      const mainMapHubs = await mainMapHubService.getAllBy(
        "main_map_id",
        mainMap.id,
        new ParametersLimit<MainMapHubModel>([], ["id", "main_map_id"]),
      );
      for (let j = 0; j < mainMapHubs.length; j++) {
        allMainMapsHubs.push(mainMapHubs[j]);
      }
    }

    const allPortals: Array<PortalModel> = [];
    for (let i = 0; i < allMainMapsHubs.length; i++) {
      const hub = allMainMapsHubs[i];
      const portals = await portalService.getAllBy(
        "from_hub_id",
        hub.id,
        new ParametersLimit<PortalModel>([], ["id", "from_hub_id"]),
      );
      for (let j = 0; j < portals.length; j++) {
        allPortals.push(portals[j]);
      }
    }

    await portalService.deleteAll(allPortals);
    await mainMapHubService.deleteAll(allMainMapsHubs);
    await mainMapService.deleteAll(mainMaps);
    await this._delete(iteration?.id);
  }
}
