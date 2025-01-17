import { ShipCannonModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipCannonRepository extends Repository<ShipCannonModel> {
  constructor() {
    super(new ShipCannonModel());
  }
}
