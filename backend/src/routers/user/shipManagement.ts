import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ShipService from "@src/services/ship/ShipService.js";
import UserService from "@src/services/user/UserService.js";
import ShipArmorService from "@src/services/ship/ShipArmorService.js";
import ShipCannonService from "@src/services/ship/ShipCannonService.js";
import ShipEnergyCoreService from "@src/services/ship/ShipEnergyCoreService.js";
import ShipEngineService from "@src/services/ship/ShipEngineService.js";
import ShipHullService from "@src/services/ship/ShipHullService.js";
import {
  ShipArmorModel,
  ShipCannonModel,
  ShipEnergyCoreModel,
  ShipEngineModel,
  ShipHullModel,
} from "@src/models/db/index.js";
import PropagatedError from "@src/models/PropagatedError.js";
import UserIslandService from "@src/services/UserIslandService.js";
import { ShipItemType } from "extorris-common";
import RedisConnector from "@src/core/RedisConnector.js";
import PortalService from "@src/services/main_map/PortalService.js";
import MainMapHubService from "@src/services/main_map/MainMapHubService.js";
import ParametersLimit from "@src/models/ParametersLimit.js";

const router = express.Router();

router.get(
  "/my_ship_data",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    const shipService = new ShipService();
    shipService.createUpdateUserDefaultShipParts(user);
    shipService.createDefaultUserShip(user);

    const shipArmorService = new ShipArmorService();
    const shipCannonService = new ShipCannonService();
    const shipEnergyCoreService = new ShipEnergyCoreService();
    const shipEngineService = new ShipEngineService();
    const shipHullService = new ShipHullService();

    const shipArmors = await shipArmorService.getAllBy("user_id", user.id);
    const shipCannons = await shipCannonService.getAllBy("user_id", user.id);
    const shipEnergyCores = await shipEnergyCoreService.getAllBy(
      "user_id",
      user.id,
    );
    const shipEngines = await shipEngineService.getAllBy("user_id", user.id);
    const shipHulls = await shipHullService.getAllBy("user_id", user.id);

    const userShip = await shipService.getBy("user_id", user.id);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        userShip: userShip?.prepareREST(),
        shipArmors: shipArmors.map((v) => v.prepareREST()),
        shipCannons: shipCannons.map((v) => v.prepareREST()),
        shipEnergyCores: shipEnergyCores.map((v) => v.prepareREST()),
        shipEngines: shipEngines.map((v) => v.prepareREST()),
        shipHulls: shipHulls.map((v) => v.prepareREST()),
      }),
    );
  },
);

router.put(
  "/fly_out",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    const shipService = new ShipService();
    const userIslandService = new UserIslandService();
    const hubService = new MainMapHubService();
    let userShip = await shipService.getBy("user_id", user.id);

    if (!userShip) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "user has no ship");
    }

    const isShipReadyToFly = await shipService.isShipReadyToFly(userShip.id);

    if (!isShipReadyToFly) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "ship doesn't have necessary items equipped",
      );
    }

    const userIsland = await userIslandService.getBy("user_id", user.id);
    if (!userIsland.main_map_hub_id) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "user island is not linked to a hub",
      );
    }

    userShip.main_map_hub_id = userIsland.main_map_hub_id;
    userShip.is_parked = false;

    userShip = await shipService.update(userShip);
    const redis = await RedisConnector.getInstance();
    const userIslandHub = await hubService.get(userIsland.main_map_hub_id);

    await shipService.writeShipToRedis(userShip);
    await redis.writeShipPosition(userShip, userIsland);
    await hubService.writeActiveHubToRedis(userIslandHub.id);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        userShip,
      }),
    );
  },
);

router.put(
  "/recall_ship",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    const shipService = new ShipService();
    const userIslandService = new UserIslandService();
    const hubService = new MainMapHubService();
    let userShip = await shipService.getBy("user_id", user.id);

    const shipWasAtHubId = userShip.main_map_hub_id;

    if (!userShip) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "user has no ship");
    }

    const userIsland = await userIslandService.getBy("user_id", user.id);

    userShip.main_map_hub_id = userIsland.main_map_hub_id;
    userShip.is_parked = true;
    userShip = await shipService.update(userShip);

    const redis = await RedisConnector.getInstance();
    await redis.writeShipPosition(userShip, userIsland);

    if (shipWasAtHubId) {
      await hubService.writeActiveHubToRedis(shipWasAtHubId);
    }

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        userShip,
      }),
    );
  },
);

router.put(
  "/equip/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    const { type } = req.params;

    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    if (!userShip.is_parked) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Ship must be parked to change equipment",
      );
    }

    switch (type as ShipItemType) {
      case ShipItemType.ARMOR:
        const shipArmorToEquip = new ShipArmorModel().parseObject(req.body);
        const shipArmorService = new ShipArmorService();
        await shipArmorService.equip(user, shipArmorToEquip);
        break;
      case ShipItemType.CANNON:
        const shipCannonToEquip = new ShipCannonModel().parseObject(req.body);
        const shipCannonService = new ShipCannonService();
        await shipCannonService.equip(user, shipCannonToEquip);
        break;
      case ShipItemType.ENERGY_CORE:
        const shipEnergyCoreToEquip = new ShipEnergyCoreModel().parseObject(
          req.body,
        );
        const shipEnergyCoreService = new ShipEnergyCoreService();
        await shipEnergyCoreService.equip(user, shipEnergyCoreToEquip);
        break;
      case ShipItemType.ENGINE:
        const shipEngineToEquip = new ShipEngineModel().parseObject(req.body);
        const shipEngineService = new ShipEngineService();
        await shipEngineService.equip(user, shipEngineToEquip);
        break;
      case ShipItemType.HULL:
        const shipHullToEquip = new ShipHullModel().parseObject(req.body);
        const shipHullService = new ShipHullService();
        await shipHullService.equip(user, shipHullToEquip);
        break;
    }
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/unequip/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    const { type } = req.params;

    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    if (!userShip.is_parked) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Ship must be parked to change equipment",
      );
    }

    switch (type as ShipItemType) {
      case ShipItemType.ARMOR:
        const shipArmorService = new ShipArmorService();
        await shipArmorService.unequipAll(user);
        break;
      case ShipItemType.CANNON:
        const shipCannonToEquip: ShipCannonModel =
          new ShipCannonModel().parseObject(req.body);
        const shipCannonService = new ShipCannonService();
        await shipCannonService.unequip(shipCannonToEquip);
        break;
      case ShipItemType.ENERGY_CORE:
        const shipEnergyCoreService = new ShipEnergyCoreService();
        await shipEnergyCoreService.unequipAll(user);
        break;
      case ShipItemType.ENGINE:
        const shipEngineService = new ShipEngineService();
        await shipEngineService.unequipAll(user);
        break;
      case ShipItemType.HULL:
        const shipHullService = new ShipHullService();
        await shipHullService.unequipAll(user);
        break;
    }
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

export default router;
