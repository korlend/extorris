import { ShipPartSubtypeModel } from "@src/models/db/index.js";
import ShipPartSubtypeRepository from "@src/repositories/ship/ShipPartSubtypeRepository.js";
import Service from "../Service.js";

export default class ShipPartSubtypeService extends Service<
  ShipPartSubtypeModel,
  ShipPartSubtypeRepository
> {
  sessionRepo = new ShipPartSubtypeRepository();

  constructor() {
    super(new ShipPartSubtypeRepository());
  }
}
