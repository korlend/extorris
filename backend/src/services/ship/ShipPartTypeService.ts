import { ShipPartTypeModel } from "@src/models/db/index.js";
import ShipPartTypeRepository from "@src/repositories/ship/ShipPartTypeRepository.js";
import Service from "../Service.js";

export default class ShipPartTypeService extends Service<
  ShipPartTypeModel,
  ShipPartTypeRepository
> {
  sessionRepo = new ShipPartTypeRepository();

  constructor() {
    super(new ShipPartTypeRepository());
  }
}
