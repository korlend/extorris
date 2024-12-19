import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ShipService from "@src/services/ship/ShipService.js";
import UserShipPartService from "@src/services/ship/UserShipPartService.js";
import ShipPartTypeService from "@src/services/ship/ShipPartTypeService.js";
import DBFilter from "@src/models/DBFilter.js";
import SearchRequestData from "@src/models/SearchRequestData.js";

const router = express.Router();

router.get(
  "/my_ship_data",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    const shipService = new ShipService();
    const userShipPartsService = new UserShipPartService();
    const shipPartTypesService = new ShipPartTypeService();

    const userShip = await shipService.getBy("user_id", user.id);
    const userShipParts = await userShipPartsService.getAllBy(
      "user_id",
      user.id,
    );
    const equippedShipParts = await userShipPartsService.getAllBy(
      "ship_id",
      userShip.id,
    );

    const existingPartTypesFilters: Array<DBFilter> = [];
    const partTypeIds: Array<number> = [];

    for (let i = 0; i < userShipParts.length; i++) {
      const partTypeId = userShipParts[i].ship_part_type_id;
      if (partTypeId && !partTypeIds.some((v) => v === partTypeId)) {
        partTypeIds.push(partTypeId);
      }
    }
    for (let i = 0; i < partTypeIds.length; i++) {
      const partTypeId = partTypeIds[i];
      existingPartTypesFilters.push(new DBFilter("id", partTypeId, "=", "OR"));
    }

    const existingShipParts = await shipPartTypesService.getSearchAll(
      new SearchRequestData(0, 10000),
      undefined,
      existingPartTypesFilters,
    );

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        userShip: userShip.prepareREST(),
        userShipParts: userShipParts.map((v) => v.prepareREST()),
        equippedShipParts: equippedShipParts.map((v) => v.prepareREST()),
        existingShipParts: existingShipParts.items.map((v) => v.prepareREST()),
      }),
    );
  },
);

export default router;
