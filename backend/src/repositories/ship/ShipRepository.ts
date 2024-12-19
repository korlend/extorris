import { ShipModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ShipRepository extends Repository<ShipModel> {
  constructor() {
    super(new ShipModel());
  }
}
