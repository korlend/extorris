import MainMapHubModel from "@src/models/db/MainMapHubModel.js";
import MainMapHubRepository from "@src/repositories/MainMapHubRepository.js";
import Service from "./Service.js";

export default class MainMapHubService extends Service<
  MainMapHubModel,
  MainMapHubRepository
> {
  sessionRepo = new MainMapHubRepository();

  constructor() {
    super(new MainMapHubRepository());
  }
}
