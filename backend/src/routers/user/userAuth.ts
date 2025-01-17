import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import { ShipModel, ShipPartTypeModel, UserModel, UserShipPartModel } from "@src/models/db/index.js";
import UserService from "@src/services/user/UserService.js";
import PropagatedError from "@src/models/PropagatedError.js";
import ShipService from "@src/services/ship/ShipService.js";
import UserShipPartService from "@src/services/ship/UserShipPartService.js";
import DBFilter from "@src/models/DBFilter.js";
import ShipPartTypeService from "@src/services/ship/ShipPartTypeService.js";
import SearchRequestData from "@src/models/SearchRequestData.js";

const router = express.Router();

// router.get('/getAll', async (req: Request, res: Response, next: NextFunction) => {
//   const userRepo = new UserRepository();
//   res.send(await userRepo.getAll());
// });

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService();
    const user = new UserModel().parseObject(req.body);
    const newUser = await userService.register(user);
    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        newUser,
      ),
    );
  },
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const userServices = new UserService();
    const { username, password } = req.body;

    const session = await userServices.login(username, password);
    if (!session.user_id) {
      throw new PropagatedError(ExpressResponseTypes.ERROR);
    }
    const user = await userServices.get(session.user_id);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        session: session.prepareREST(),
        user: user.prepareREST(),
      }),
    );
  },
);

router.put(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    const { session } = res.locals;
    const userServices = new UserService();
    await userServices.logout(session);
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  const { user, session } = res.locals;
  const shipService = new ShipService();
  const userShipPartsService = new UserShipPartService();
  const shipPartTypesService = new ShipPartTypeService();
  const defaultUserShipPartsRequirement = [
    {
      code_name: "default_wings",
      amount: 1,
    },
    {
      code_name: "default_engine",
      amount: 1,
    },
    {
      code_name: "default_hull",
      amount: 1,
    },
    {
      code_name: "default_reactor",
      amount: 1,
    },
    {
      code_name: "default_armor",
      amount: 1,
    },
    {
      code_name: "default_crossbow_cannon",
      amount: 4,
    },
  ];

  // const crossbowFilters: Array<DBFilter> = [];
  // crossbowFilters.push(new DBFilter("code_name", "default_crossbow_cannon"));
  // crossbowFilters.push(new DBFilter("user_id", user.id));
  // const crossbowTotal = await userShipPartsService.getAllCount(crossbowFilters);


  /* START creating default ship parts */
  const defaultShipPartFilters: Array<DBFilter<ShipPartTypeModel>> = [];
  for (let i = 0; i < defaultUserShipPartsRequirement.length; i++) {
    const code = defaultUserShipPartsRequirement[i];
    defaultShipPartFilters.push(
      new DBFilter("code_name", code.code_name, "=", "OR"),
    );
  }
  const defaultUserShipParts = await shipPartTypesService.getSearchAll(
    new SearchRequestData(0, 10000),
    undefined,
    defaultShipPartFilters,
  );

  let userShipParts = await userShipPartsService.getAllBy("user_id", user.id);
  for (let i = 0; i < defaultUserShipParts.items.length; i++) {
    const defaultShipPart = defaultUserShipParts.items[i];
    const defaultShipPartRequirement = defaultUserShipPartsRequirement.find(
      (v) => v.code_name === defaultShipPart.code_name,
    );
    if (!defaultShipPartRequirement) {
      // should be error
      continue;
    }
    const existingAmount = userShipParts.filter(
      (v) => v.ship_part_type_id === defaultShipPart.id,
    ).length;
    const amountDiff = defaultShipPartRequirement.amount - existingAmount;
    for (let j = 0; j < amountDiff; j++) {
      const newUserShipPart = new UserShipPartModel();
      newUserShipPart.user_id = user.id;
      newUserShipPart.ship_part_type_id = defaultShipPart.id;
      newUserShipPart.subtype_id = defaultShipPart.subtype_id;
      // should set ship id? probably if ship has empty slot
      // newUserShipPart.ship_id
      userShipPartsService.create(newUserShipPart);
    }
  }
  /* END creating default ship parts */

  /* START creating default ship for user */
  let userShips = await shipService.getAllBy("user_id", user.id);
  if (!userShips || !userShips.length) {
    const newShip = new ShipModel();
    newShip.user_id = user.id;
    await shipService.create(newShip);
  }
  /* END creating default ship for user */
  next(
    ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
      session: session.prepareREST(),
      user: user.prepareREST(),
      userShips: userShips.map((v) => v.prepareREST()),
    }),
  );
});

export default router;
