import {
  MainMapHubModel,
  MainMapModel,
  UserBeenToHubsModel,
} from "@src/models/db/index.js";
import Repository from "../Repository.js";
import MainMapRepository from "./MainMapRepository.js";
import IterationRepository from "../IterationRepository.js";
import UserBeenToHubsRepository from "./UserBeenToHubsRepository.js";
import DBFilter from "@src/models/DBFilter.js";
import DBFilterBuilder from "@src/core/utils/db/DBFilterBuilder.js";

export default class MainMapHubRepository extends Repository<MainMapHubModel> {
  constructor() {
    super(new MainMapHubModel());
  }

  async getUserHubHistory(
    userId: number,
    mainMapIds: Array<number>,
  ): Promise<Array<MainMapHubModel>>;
  async getUserHubHistory(
    userId: number,
    mainMapId: number,
  ): Promise<Array<MainMapHubModel>>;
  async getUserHubHistory(
    userId: number,
    mainMapIds: number | Array<number>,
  ): Promise<Array<MainMapHubModel>>;
  async getUserHubHistory(
    userId: number,
    mainMapIds: number | Array<number>,
  ): Promise<Array<MainMapHubModel>> {
    const ubthr = new UserBeenToHubsRepository();

    const hubFilters: Array<DBFilter<MainMapHubModel>> = [];
    if (mainMapIds instanceof Array) {
      for (let i = 0; i < mainMapIds.length; i++) {
        const id = mainMapIds[i];
        hubFilters.push(new DBFilter("main_map_id", id, "=", "OR"));
      }
    } else {
      hubFilters.push(new DBFilter("main_map_id", mainMapIds));
    }

    const hubUserFilters: Array<DBFilter<UserBeenToHubsModel>> = [];
    hubUserFilters.push(new DBFilter("user_id", userId));

    const hubFilterBuilder = new DBFilterBuilder(hubFilters, "mm");
    const hubUserFilterBuilder = new DBFilterBuilder(hubUserFilters, "ubth");
    return this.connector
      .query(
        `
          select mmh.* from ${ubthr.target} ubth
          left join ${this.target} mmh on ubth.hub_id = mmh.id
          where (${hubFilterBuilder.query}) and ${hubUserFilterBuilder.query}
        `,
        [...hubFilterBuilder.values, ...hubUserFilterBuilder.values],
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }
}
