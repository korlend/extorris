import { ShipModuleTypeModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipModuleTypeRepository extends Repository<ShipModuleTypeModel> {
  constructor() {
    super(new ShipModuleTypeModel());
  }
}
