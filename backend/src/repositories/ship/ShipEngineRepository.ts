import { ShipEngineModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipEngineRepository extends Repository<ShipEngineModel> {
  constructor() {
    super(new ShipEngineModel());
  }
}
