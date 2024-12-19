import { UserShipModuleModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class UserShipModuleRepository extends Repository<UserShipModuleModel> {
  constructor() {
    super(new UserShipModuleModel());
  }
}
