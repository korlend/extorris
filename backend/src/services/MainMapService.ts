import MainMapModel from "@src/models/db/MainMapModel.js";
import MainMapRepository from "@src/repositories/MainMapRepository.js";
import Service from "./Service.js";

export default class MainMapService extends Service<
  MainMapModel,
  MainMapRepository
> {
  sessionRepo = new MainMapRepository();

  constructor() {
    super(new MainMapRepository());
  }
}
