import { ShipHullModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipHullRepository extends Repository<ShipHullModel> {
  constructor() {
    super(new ShipHullModel());
  }
}
