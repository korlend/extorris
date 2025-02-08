import { UserBeenToHubsModel } from "@src/models/db/index.js";
import UserBeenToHubsRepository from "@src/repositories/main_map/UserBeenToHubsRepository.js";
import Service from "../Service.js";

export default class UserBeenToHubsService extends Service<
  UserBeenToHubsModel,
  UserBeenToHubsRepository
> {
  constructor() {
    super(new UserBeenToHubsRepository());
  }
}
