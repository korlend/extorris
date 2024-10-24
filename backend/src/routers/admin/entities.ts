import express, { Request, Response, NextFunction } from "express";

import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import PropagatedError from "@src/models/PropagatedError.js";

import DummyService from "@src/services/DummyService.js";
import DummyModel from "@src/models/db/DummyModel.js";

// services
import AdminService from "@src/services/AdminService.js";
import AdminSessionService from "@src/services/AdminSessionService.js";
import IterationService from "@src/services/IterationService.js";
import MainMapHubService from "@src/services/MainMapHubService.js";
import MainMapService from "@src/services/MainMapService.js";
import UserService from "@src/services/UserService.js";
import UserSessionService from "@src/services/UserSessionService.js";

// models
import AdminModel from "@src/models/db/AdminModel.js";
import AdminSessionModel from "@src/models/db/AdminSessionModel.js";
import IterationModel from "@src/models/db/IterationModel.js";
import MainMapHubModel from "@src/models/db/MainMapHubModel.js";
import MainMapModel from "@src/models/db/MainMapModel.js";
import UserModel from "@src/models/db/UserModel.js";
import UserSessionModel from "@src/models/db/UserSessionModel.js";
import SearchRequestData from "@src/models/SearchRequestData.js";

const router = express.Router();

const entityServices: Record<string, any> = {
  admin: AdminService,
  admin_session: AdminSessionService,
  iteration: IterationService,
  main_map_hub: MainMapHubService,
  main_map: MainMapService,
  user: UserService,
  user_session: UserSessionService,
};

const entityModels: Record<string, any> = {
  admin: AdminModel,
  admin_session: AdminSessionModel,
  iteration: IterationModel,
  main_map_hub: MainMapHubModel,
  main_map: MainMapModel,
  user: UserModel,
  user_session: UserSessionModel,
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
    const model: DummyModel = new entityModels[params.entity]();
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
    const entityService: DummyService = new entityServices[params.entity]();
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
    const entityService: DummyService = new entityServices[params.entity]();
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
    const entityService: DummyService = new entityServices[params.entity]();
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
    const entityService: DummyService = new entityServices[params.entity]();
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
    const entityService: DummyService = new entityServices[params.entity]();
    const data = await entityService.delete(parseInt(params.id));
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

export default router;
