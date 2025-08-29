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
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import PropagatedError from "@src/models/PropagatedError.js";
import MainMapHubService from "../main_map/MainMapHubService.js";
import UserIslandService from "../UserIslandService.js";
import {
  ConfigDimensionsTypes,
  RTCalcInstructionsTypes,
} from "extorris-common";
import ConfigDimensionsService from "../ConfigDimensionsService.js";
import PortalService from "../main_map/PortalService.js";

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
      new ParametersLimit([], ["ship_id"]),
    );
    await shipCannonService.createUpdateAll(
      modelCannons,
      getByFilters,
      new ParametersLimit([], ["ship_id"]),
    );
    await shipEnergyCoreService.createUpdateAll(
      modelEnergyCores,
      getByFilters,
      new ParametersLimit([], ["ship_id"]),
    );
    await shipEngineService.createUpdateAll(
      modelEngines,
      getByFilters,
      new ParametersLimit([], ["ship_id"]),
    );
    await shipHullService.createUpdateAll(
      modelHulls,
      getByFilters,
      new ParametersLimit([], ["ship_id"]),
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

  async persistShipsPositions(): Promise<void> {
    const redisConnector = await RedisConnector.getInstance();
    const ships = await this.getAllBy("is_parked", false);
    const shipsToUpdate = [];
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const redisShip = await redisConnector.getShipPosition(ship.id);
      if (!redisShip) {
        continue;
      }
      ship.x = redisShip?.x;
      ship.y = redisShip?.y;
      shipsToUpdate.push(ship);
    }
    await this.updateAll(shipsToUpdate, new ParametersLimit(["x", "y"]));
  }

  async flyOutFromIsland(userId: number): Promise<ShipModel> {
    const userIslandService = new UserIslandService();
    const hubService = new MainMapHubService();
    const configDimensionService = new ConfigDimensionsService();
    let userShip = await this.getBy("user_id", userId);
    if (!userShip) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "user has no ship");
    }

    const isShipReadyToFly = await this.isShipReadyToFly(userShip.id);

    if (!isShipReadyToFly) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "ship doesn't have necessary items equipped",
      );
    }

    const userIsland = await userIslandService.getBy("user_id", userId);
    if (!userIsland.main_map_hub_id) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "user island is not linked to a hub",
      );
    }
    const hubId = userIsland.main_map_hub_id;
    const shipSpawnDistanceX = await configDimensionService.getBy(
      "name",
      ConfigDimensionsTypes.SHIP_SPAWN_DISTANCE_X,
    );
    const shipSpawnDistanceY = await configDimensionService.getBy(
      "name",
      ConfigDimensionsTypes.SHIP_SPAWN_DISTANCE_Y,
    );

    userShip.x = userIsland.hub_pos_x + shipSpawnDistanceX.value;
    userShip.y = userIsland.hub_pos_y + shipSpawnDistanceY.value;

    userShip.main_map_hub_id = hubId;
    userShip.is_parked = false;

    const redis = await RedisConnector.getInstance();

    const rtcalcUuid = await hubService.writeActiveHubToRedis(hubId);
    if (!rtcalcUuid) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Can't assign hub to rtcalc service",
      );
    }
    userShip = await this.update(userShip);
    await this.writeShipToRedis(userShip);
    await redis.writeShipPosition(userShip);
    await redis.writeRTCalcInstruction(rtcalcUuid, {
      type: RTCalcInstructionsTypes.ADD_SHIP_TO_HUB,
      hubId,
      shipId: userShip.id,
    });

    return userShip;
  }

  async shipEnteredPortal(
    userId: number,
    portalId: number,
    fromHubId: number,
  ): Promise<ShipModel | null> {
    const hubService = new MainMapHubService();
    const portalService = new PortalService();
    const configDimensionService = new ConfigDimensionsService();

    let userShip = await this.getBy("user_id", userId);
    if (!userShip) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "user has no ship");
    }

    // in case "entering portal" event is duplicated
    if (userShip.main_map_hub_id === fromHubId) {
      return null;
    }

    const enteredPortal = await portalService.get(portalId);
    const fromHub = await hubService.get(fromHubId);

    let outPortalX;
    let outPortalY;
    let outPortalHubId;
    let inPortalHubId;

    if (enteredPortal.from_hub_id === fromHub.id) {
      outPortalX = enteredPortal.to_hub_position_x;
      outPortalY = enteredPortal.to_hub_position_y;
      outPortalHubId = enteredPortal.to_hub_id;
      inPortalHubId = enteredPortal.from_hub_id;
    } else {
      outPortalX = enteredPortal.from_hub_position_x;
      outPortalY = enteredPortal.from_hub_position_y;
      outPortalHubId = enteredPortal.from_hub_id;
      inPortalHubId = enteredPortal.to_hub_id;
    }

    if (!outPortalHubId) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        `During ship entering portal, OUT portal is not assigned at portal id: ${portalId}`,
      );
    }

    if (!inPortalHubId) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        `During ship entering portal, IN portal is not assigned at portal id: ${portalId}`,
      );
    }

    const shipSpawnDistanceX = await configDimensionService.getBy(
      "name",
      ConfigDimensionsTypes.SHIP_SPAWN_DISTANCE_X,
    );
    const shipSpawnDistanceY = await configDimensionService.getBy(
      "name",
      ConfigDimensionsTypes.SHIP_SPAWN_DISTANCE_Y,
    );

    userShip.x = outPortalX + shipSpawnDistanceX.value;
    userShip.y = outPortalY + shipSpawnDistanceY.value;

    userShip.main_map_hub_id = outPortalHubId;

    const redis = await RedisConnector.getInstance();

    const newRtcalcUuid =
      await hubService.writeActiveHubToRedis(outPortalHubId);
    const oldRtcalcUuid = await hubService.writeActiveHubToRedis(inPortalHubId);
    if (!newRtcalcUuid) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        `Can't assign hub (${outPortalHubId}) to rtcalc service`,
      );
    }
    if (!oldRtcalcUuid) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        `Can't assign hub (${inPortalHubId}) to rtcalc service`,
      );
    }

    userShip = await this.update(userShip);

    await this.writeShipToRedis(userShip);
    await redis.writeShipPosition(userShip);
    await redis.writeRTCalcInstruction(oldRtcalcUuid, {
      type: RTCalcInstructionsTypes.REMOVE_SHIP_FROM_HUB,
      hubId: inPortalHubId,
      shipId: userShip.id,
    });
    await redis.writeRTCalcInstruction(newRtcalcUuid, {
      type: RTCalcInstructionsTypes.ADD_SHIP_TO_HUB,
      hubId: outPortalHubId,
      shipId: userShip.id,
    });
    await redis.writeRTCalcInstruction(newRtcalcUuid, {
      type: RTCalcInstructionsTypes.CHANGE_SHIP_POSITION,
      shipId: userShip.id,
      newAngle: 0,
      newPosX: userShip.x,
      newPosY: userShip.y,
    });

    return userShip;
  }
}
