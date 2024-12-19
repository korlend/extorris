import { UserShipPartModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class UserShipPartRepository extends Repository<UserShipPartModel> {
  constructor() {
    super(new UserShipPartModel());
  }
}
