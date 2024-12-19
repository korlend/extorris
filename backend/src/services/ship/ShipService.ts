import { ShipModel } from "@src/models/db/index.js";
import ShipRepository from "@src/repositories/ship/ShipRepository.js";
import Service from "../Service.js";

export default class ShipService extends Service<
  ShipModel,
  ShipRepository
> {
  sessionRepo = new ShipRepository();

  constructor() {
    super(new ShipRepository());
  }
}
