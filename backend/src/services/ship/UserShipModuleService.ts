import { UserShipModuleModel } from "@src/models/db/index.js";
import UserShipModuleRepository from "@src/repositories/ship/UserShipModuleRepository.js";
import Service from "../Service.js";

export default class UserShipModuleService extends Service<
  UserShipModuleModel,
  UserShipModuleRepository
> {
  constructor() {
    super(new UserShipModuleRepository());
  }
}
