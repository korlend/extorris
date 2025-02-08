import UserIslandModel from "@src/models/db/UserIslandModel.js";
import UserIslandRepository from "@src/repositories/UserIslandRepository.js";
import Service from "./Service.js";

export default class UserIslandService extends Service<
  UserIslandModel,
  UserIslandRepository
> {
  constructor() {
    super(new UserIslandRepository());
  }
}
