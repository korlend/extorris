import { ShipPartTypeModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipPartTypeRepository extends Repository<ShipPartTypeModel> {
  constructor() {
    super(new ShipPartTypeModel());
  }
}
