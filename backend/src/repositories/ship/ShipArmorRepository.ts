import { ShipArmorModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipArmorRepository extends Repository<ShipArmorModel> {
  constructor() {
    super(new ShipArmorModel());
  }
}
