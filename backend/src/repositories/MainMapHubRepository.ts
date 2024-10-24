import MainMapHubModel from "@src/models/db/MainMapHubModel.js";
import Repository from "./Repository.js";

export default class MainMapHubRepository extends Repository<MainMapHubModel> {
  constructor() {
    super(new MainMapHubModel(), "main_map_hubs");
  }
}
