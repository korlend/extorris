import { ShipPartSubtypeModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipPartSubtypeRepository extends Repository<ShipPartSubtypeModel> {
  constructor() {
    super(new ShipPartSubtypeModel());
  }
}
