import { UserShipPartModel } from "@src/models/db/index.js";
import UserShipPartRepository from "@src/repositories/ship/UserShipPartRepository.js";
import Service from "../Service.js";

export default class UserShipPartService extends Service<
  UserShipPartModel,
  UserShipPartRepository
> {
  sessionRepo = new UserShipPartRepository();

  constructor() {
    super(new UserShipPartRepository());
  }
}
