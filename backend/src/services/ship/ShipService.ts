import {
  ShipArmorModel,
  ShipCannonModel,
  ShipEnergyCoreModel,
  ShipEngineModel,
  ShipHullModel,
  ShipModel,
  UserModel,
} from "@src/models/db/index.js";
import ShipRepository from "@src/repositories/ship/ShipRepository.js";
import Service from "../Service.js";
import ShipArmorService from "./ShipArmorService.js";
import ShipCannonService from "./ShipCannonService.js";
import ShipEnergyCoreService from "./ShipEnergyCoreService.js";
import ShipEngineService from "./ShipEngineService.js";
import ShipHullService from "./ShipHullService.js";
import RedisConnector from "@src/core/RedisConnector.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import {
  generateDefaultArmors,
  generateDefaultCannons,
  generateDefaultEnergyCores,
  generateDefaultEngines,
  generateDefaultHulls,
} from "defaults/models/user/index.js";

export default class ShipService extends Service<ShipModel, ShipRepository> {
  constructor() {
    super(new ShipRepository());
  }

  async createUpdateUserDefaultShipParts(user: UserModel): Promise<void> {
    const modelArmors = await generateDefaultArmors(user.id);
    const modelCannons = await generateDefaultCannons(user.id);
    const modelEnergyCores = await generateDefaultEnergyCores(user.id);
    const modelEngines = await generateDefaultEngines(user.id);
    const modelHulls = await generateDefaultHulls(user.id);

    const shipArmorService = new ShipArmorService();
    const shipCannonService = new ShipCannonService();
    const shipEnergyCoreService = new ShipEnergyCoreService();
    const shipEngineService = new ShipEngineService();
    const shipHullService = new ShipHullService();

    const getByFilters: Array<
      DBModelDBDataKeys<ShipArmorModel> &
        DBModelDBDataKeys<ShipCannonModel> &
        DBModelDBDataKeys<ShipEnergyCoreModel> &
        DBModelDBDataKeys<ShipEngineModel> &
        DBModelDBDataKeys<ShipHullModel>
    > = ["user_id", "code_name"];

    // limiting update of ship_id otherwise we unequip all ship items

    await shipArmorService.createUpdateAll(
      modelArmors,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipCannonService.createUpdateAll(
      modelCannons,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipEnergyCoreService.createUpdateAll(
      modelEnergyCores,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipEngineService.createUpdateAll(
      modelEngines,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipHullService.createUpdateAll(
      modelHulls,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
  }

  async createDefaultUserShip(user: UserModel): Promise<void> {
    const userShip = await this.getBy("user_id", user.id);

    if (!userShip) {
      const newUserShip = new ShipModel();
      newUserShip.user_id = user.id;
      newUserShip.is_parked = true;
      await this.create(newUserShip);
    }
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

  async writeShipToRedis(ship: ShipModel): Promise<void> {
    const redis = await RedisConnector.getInstance();
    const shipArmorService = new ShipArmorService();
    const shipCannonService = new ShipCannonService();
    const shipEnergyCoreService = new ShipEnergyCoreService();
    const shipEngineService = new ShipEngineService();
    const shipHullService = new ShipHullService();

    const shipArmor = await shipArmorService.getBy("ship_id", ship.id);
    const shipCannons = await shipCannonService.getAllBy("ship_id", ship.id);
    const shipEnergyCore = await shipEnergyCoreService.getBy(
      "ship_id",
      ship.id,
    );
    const shipEngine = await shipEngineService.getBy("ship_id", ship.id);
    const shipHull = await shipHullService.getBy("ship_id", ship.id);

    await redis.writeShipData(
      ship,
      shipArmor,
      shipCannons,
      shipEnergyCore,
      shipEngine,
      shipHull,
    );
  }
}
