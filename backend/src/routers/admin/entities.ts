import express, { Request, Response, NextFunction } from "express";

import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import PropagatedError from "@src/models/PropagatedError.js";

import SearchRequestData from "@src/models/SearchRequestData.js";
import EntityType from "@src/enums/EntityType.js";

import DummyService from "@src/services/DummyService.js";
import DummyModel from "@src/models/db/DummyModel.js";

// services
import AdminRoleService from "@src/services/AdminRoleService.js";
import AdminService from "@src/services/AdminService.js";
import AdminSessionService from "@src/services/AdminSessionService.js";
import InlandCreatureService from "@src/services/InlandCreatureService.js";
import IterationService from "@src/services/IterationService.js";
import MainMapHubService from "@src/services/MainMapHubService.js";
import MainMapService from "@src/services/MainMapService.js";
import NestService from "@src/services/NestService.js";
import NestTypeService from "@src/services/NestTypeService.js";
import UserService from "@src/services/UserService.js";
import UserSessionService from "@src/services/UserSessionService.js";

// models
import AdminRoleModel from "@src/models/db/AdminRoleModel.js";
import AdminModel from "@src/models/db/AdminModel.js";
import AdminSessionModel from "@src/models/db/AdminSessionModel.js";
import InlandCreatureModel from "@src/models/db/InlandCreatureModel.js";
import IterationModel from "@src/models/db/IterationModel.js";
import MainMapHubModel from "@src/models/db/MainMapHubModel.js";
import MainMapModel from "@src/models/db/MainMapModel.js";
import NestModel from "@src/models/db/NestModel.js";
import NestTypeModel from "@src/models/db/NestTypeModel.js";
import UserModel from "@src/models/db/UserModel.js";
import UserSessionModel from "@src/models/db/UserSessionModel.js";



const router = express.Router();

const entityServices: Record<EntityType, any> = {
  [EntityType.ADMIN]: AdminService,
  [EntityType.ADMIN_ROLE]: AdminRoleService,
  [EntityType.ADMIN_SESSION]: AdminSessionService,
  [EntityType.INLAND_CREATURE]: InlandCreatureService,
  [EntityType.ITERATION]: IterationService,
  [EntityType.MAIN_MAP_HUB]: MainMapHubService,
  [EntityType.MAIN_MAP]: MainMapService,
  [EntityType.NEST]: NestService,
  [EntityType.NEST_TYPE]: NestTypeService,
  [EntityType.USER]: UserService,
  [EntityType.USER_SESSION]: UserSessionService,
};

const entityModels: Record<EntityType, any> = {
  [EntityType.ADMIN]: AdminModel,
  [EntityType.ADMIN_ROLE]: AdminRoleModel,
  [EntityType.ADMIN_SESSION]: AdminSessionModel,
  [EntityType.INLAND_CREATURE]: InlandCreatureModel,
  [EntityType.ITERATION]: IterationModel,
  [EntityType.MAIN_MAP_HUB]: MainMapHubModel,
  [EntityType.MAIN_MAP]: MainMapModel,
  [EntityType.NEST]: NestModel,
  [EntityType.NEST_TYPE]: NestTypeModel,
  [EntityType.USER]: UserModel,
  [EntityType.USER_SESSION]: UserSessionModel,
};

router.get(
  "/get-list",
  async (req: Request, res: Response, next: NextFunction) => {
    const keys = Object.keys(entityServices);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, keys),
    );
  },
);

router.get(
  "/get-info/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const model: DummyModel = new entityModels[params.entity as EntityType]();
    const keys = Object.keys(model.prepareREST());
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        keys,
      }),
    );
  },
);

router.get(
  "/get/:entity/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const entityService: DummyService = new entityServices[params.entity as EntityType]();
    if (!entityService) {
      throw new PropagatedError();
    }
    const data = await entityService.get(parseInt(params.id));
    if (!data) {
      throw new PropagatedError(
        ExpressResponseTypes.NO_CONTENT,
        `id doesn't exist on entity ${params.entity}`,
      );
    }
    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        data.prepareREST(),
      ),
    );
  },
);

router.get(
  "/filter/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params, query } = req;
    const entityService: DummyService = new entityServices[params.entity as EntityType]();
    if (!entityService) {
      throw new PropagatedError();
    }
    const data = await entityService.getSearchAll(
      new SearchRequestData(
        parseInt(query.from as string),
        parseInt(query.pageSize as string),
      ),
    );
    const total = data.total;
    const preparedData = data.items.map((v) => v.prepareREST());
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        items: preparedData,
        total: total,
      }),
    );
  },
);

router.post(
  "/create/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body, params } = req;
    const entityService: DummyService = new entityServices[params.entity as EntityType]();
    const data = await entityService.create(body);
    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        data.id,
      ),
    );
  },
);

router.put(
  "/update/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body, params } = req;
    const entityService: DummyService = new entityServices[params.entity as EntityType]();
    const data = await entityService.update(body);
    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        data.id,
      ),
    );
  },
);

router.delete(
  "/delete/:entity/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const entityService: DummyService = new entityServices[params.entity as EntityType]();
    const data = await entityService.delete(parseInt(params.id));
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

export default router;
