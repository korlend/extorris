import { ShipModel } from "@src/models/db/index.js";
import ShipRepository from "@src/repositories/ship/ShipRepository.js";
import Service from "../Service.js";
import ShipArmorService from "./ShipArmorService.js";
import ShipCannonService from "./ShipCannonService.js";
import ShipEnergyCoreService from "./ShipEnergyCoreService.js";
import ShipEngineService from "./ShipEngineService.js";
import ShipHullService from "./ShipHullService.js";

export default class ShipService extends Service<
  ShipModel,
  ShipRepository
> {
  constructor() {
    super(new ShipRepository());
  }

  async isShipReadyToFly(shipId: number): Promise<boolean> {
    const shipArmorService = new ShipArmorService();
    const shipCannonService = new ShipCannonService();
    const shipEnergyCoreService = new ShipEnergyCoreService();
    const shipEngineService = new ShipEngineService();
    const shipHullService = new ShipHullService();

    const shipArmor = await shipArmorService.getBy("ship_id", shipId);
    const shipCannon = await shipCannonService.getBy("ship_id", shipId);
    const shipEnergyCore = await shipEnergyCoreService.getBy("ship_id", shipId);
    const shipEngine = await shipEngineService.getBy("ship_id", shipId);
    const shipHull = await shipHullService.getBy("ship_id", shipId);

    if (!shipArmor) return false;
    if (!shipCannon) return false;
    if (!shipEnergyCore) return false;
    if (!shipEngine) return false;
    if (!shipHull) return false;

    return true;
  }
}
