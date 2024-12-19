import { UserIslandModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class UserIslandRepository extends Repository<UserIslandModel> {
  constructor() {
    super(new UserIslandModel());
  }
}
