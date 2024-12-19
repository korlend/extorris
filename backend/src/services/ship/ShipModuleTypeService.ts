import { ShipModuleTypeModel } from "@src/models/db/index.js";
import ShipModuleTypeRepository from "@src/repositories/ship/ShipModuleTypeRepository.js";
import Service from "../Service.js";

export default class ShipModuleTypeService extends Service<
  ShipModuleTypeModel,
  ShipModuleTypeRepository
> {
  sessionRepo = new ShipModuleTypeRepository();

  constructor() {
    super(new ShipModuleTypeRepository());
  }
}
