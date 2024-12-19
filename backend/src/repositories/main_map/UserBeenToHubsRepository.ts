import { UserBeenToHubsModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class UserBeenToHubsRepository extends Repository<UserBeenToHubsModel> {
  constructor() {
    super(new UserBeenToHubsModel());
  }
}
