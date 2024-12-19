import { MainMapHubModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class MainMapHubRepository extends Repository<MainMapHubModel> {
  constructor() {
    super(new MainMapHubModel());
  }

  // async getUserHubHistory(iterationId: number): Promise<Array<MainMapHubModel>> {
  //   return this.connector
  //     .query(
  //       `
  //     select mmh.* from ${this.target}
  //     where iteration_id = ? 
  //     ${this.defaultFilters()}
  //   `,
  //       [value],
  //     )
  //     .then((resp) => this.modelsFromDataPacket(resp));
  // }
}
