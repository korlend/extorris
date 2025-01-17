import { ShipEnergyCoreModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipEnergyCoreRepository extends Repository<ShipEnergyCoreModel> {
  constructor() {
    super(new ShipEnergyCoreModel());
  }
}
