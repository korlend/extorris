import { MainMapHubModel, PortalModel } from "@src/models/db/index.js";
import PortalRepository from "@src/repositories/main_map/PortalRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";
import SearchRequestData from "@src/models/SearchRequestData.js";

export default class PortalService extends Service<
  PortalModel,
  PortalRepository
> {
  constructor() {
    super(new PortalRepository());
  }

  async getHubPortals(hubId: number): Promise<Array<PortalModel>>;
  async getHubPortals(hubIds: Array<number>): Promise<Array<PortalModel>>;
  async getHubPortals(hubIds: number | Array<number>): Promise<Array<PortalModel>>;
  async getHubPortals(hubs: number | Array<number>): Promise<Array<PortalModel>> {
    const filters: Array<DBFilter<PortalModel>> = [];
    if (hubs instanceof Array) {
      for (let i = 0; i < hubs.length; i++) {
        const hub = hubs[i];
        filters.push(new DBFilter("from_hub_id", hub, "=", "OR"));
        filters.push(new DBFilter("to_hub_id", hub, "=", "OR"));
      }
    } else {
      filters.push(new DBFilter("from_hub_id", hubs, "=", "OR"));
      filters.push(new DBFilter("to_hub_id", hubs, "=", "OR"));
    }
    const portals = await this.getSearchAll(
      new SearchRequestData(0, 10000),
      filters,
    );
    return portals?.items || [];
  }
}
