import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ShipService from "@src/services/ship/ShipService.js";
import UserShipPartService from "@src/services/ship/UserShipPartService.js";
import ShipPartTypeService from "@src/services/ship/ShipPartTypeService.js";
import DBFilter from "@src/models/DBFilter.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import ShipPartSubtypeService from "@src/services/ship/ShipPartSubtypeService.js";
import ImageService from "@src/services/ImageService.js";
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
import ParametersLimit from "@src/models/ParametersLimit.js";

const router = express.Router();

router.get(
  "/my_ship_data",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const userService = new UserService();
    userService.createUpdateUserDefaultShipParts(user);
    userService.createDefaultUserShip(user);

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

    const shipService = new ShipService();
    // const userShipPartsService = new UserShipPartService();
    // const shipPartTypesService = new ShipPartTypeService();
    // const shipPartSubtypesService = new ShipPartSubtypeService();
    // const imagesService = new ImageService();

    const userShip = await shipService.getBy("user_id", user.id);
    // const userShipParts = await userShipPartsService.getAllBy(
    //   "user_id",
    //   user.id,
    // );
    // const equippedShipParts = await userShipPartsService.getAllBy(
    //   "ship_id",
    //   userShip.id,
    // );

    // const existingPartTypesFilters: Array<DBFilter> = [];
    // const partTypeIds: Array<number> = [];

    // for (let i = 0; i < userShipParts.length; i++) {
    //   const partTypeId = userShipParts[i].ship_part_type_id;
    //   if (partTypeId && !partTypeIds.some((v) => v === partTypeId)) {
    //     partTypeIds.push(partTypeId);
    //   }
    // }
    // for (let i = 0; i < partTypeIds.length; i++) {
    //   const partTypeId = partTypeIds[i];
    //   existingPartTypesFilters.push(new DBFilter("id", partTypeId, "=", "OR"));
    // }

    // const existingShipParts = await shipPartTypesService.getSearchAll(
    //   new SearchRequestData(0, 10000),
    //   undefined,
    //   existingPartTypesFilters,
    // );

    // const shipPartSubtypes = await shipPartSubtypesService.getAll();

    // const imagesIds: Array<number> = [];
    // for (let i = 0; i < shipPartSubtypes.length; i++) {
    //   const imageId = shipPartSubtypes[i].image_id;
    //   if (imageId && !imagesIds.some((v) => v === imageId)) {
    //     imagesIds.push(imageId)
    //   }
    // }

    // const images = await imagesService.getAllByIds(imagesIds);

    // const preparedShipPartSubtypes = shipPartSubtypes.map(v => ({
    //   ...v.prepareREST(),
    //   image: images.find(i => i.id === v.image_id)?.prepareREST(),
    // }))

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        userShip: userShip.prepareREST(),
        // userShipParts: userShipParts.map((v) => v.prepareREST()),
        // equippedShipParts: equippedShipParts.map((v) => v.prepareREST()),
        // existingShipParts: existingShipParts.items.map((v) => v.prepareREST()),
        // shipPartSubtypes: preparedShipPartSubtypes,
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
  "/equip_ship_armor",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipArmorToEquip: ShipArmorModel = new ShipArmorModel().parseObject(
      req.body,
    );
    const shipArmorService = new ShipArmorService();

    await shipArmorService.equip(user, shipArmorToEquip);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/equip_ship_cannon",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipCannonToEquip: ShipCannonModel =
      new ShipCannonModel().parseObject(req.body);

    const shipCannonService = new ShipCannonService();
    await shipCannonService.equip(user, shipCannonToEquip);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/equip_ship_energy_core",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipEnergyCoreToEquip: ShipEnergyCoreModel =
      new ShipEnergyCoreModel().parseObject(req.body);
    const shipEnergyCoreService = new ShipEnergyCoreService();

    await shipEnergyCoreService.equip(user, shipEnergyCoreToEquip);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/equip_ship_engine",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipEngineToEquip: ShipEngineModel =
      new ShipEngineModel().parseObject(req.body);
    const shipEngineService = new ShipEngineService();

    await shipEngineService.equip(user, shipEngineToEquip);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/equip_ship_hull",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipHullToEquip: ShipHullModel = new ShipHullModel().parseObject(
      req.body,
    );
    const shipHullService = new ShipHullService();

    await shipHullService.equip(user, shipHullToEquip);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/unequip_ship_armor",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipArmorService = new ShipArmorService();

    await shipArmorService.unequipAll(user);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/unequip_ship_cannon",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipCannonToEquip: ShipCannonModel =
      new ShipCannonModel().parseObject(req.body);

    const shipCannonService = new ShipCannonService();
    await shipCannonService.unequip(shipCannonToEquip);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/unequip_ship_energy_core",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipEnergyCoreService = new ShipEnergyCoreService();

    await shipEnergyCoreService.unequipAll(user);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/unequip_ship_engine",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipEngineService = new ShipEngineService();

    await shipEngineService.unequipAll(user);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

router.put(
  "/unequip_ship_hull",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      next(
        ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN),
      );
      return;
    }

    const shipHullService = new ShipHullService();

    await shipHullService.unequipAll(user);

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {}),
    );
  },
);

export default router;
