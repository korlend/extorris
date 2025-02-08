import { ShipPartSubtypeModel } from "@src/models/db/index.js";
import ShipPartSubtypeRepository from "@src/repositories/ship/ShipPartSubtypeRepository.js";
import Service from "../Service.js";

export default class ShipPartSubtypeService extends Service<
  ShipPartSubtypeModel,
  ShipPartSubtypeRepository
> {
  constructor() {
    super(new ShipPartSubtypeRepository());
  }
}
