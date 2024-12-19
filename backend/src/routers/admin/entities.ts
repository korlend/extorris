import express, { Request, Response, NextFunction } from "express";

import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import PropagatedError from "@src/models/PropagatedError.js";

import SearchRequestData from "@src/models/SearchRequestData.js";
import EntityType from "@src/enums/EntityType.js";

import DummyService from "@src/services/DummyService.js";
import DummyModel from "@src/models/db/DummyModel.js";
import {
  AdminModel,
  AdminRoleModel,
  AdminSessionModel,
  CountryModel,
  DungeonIslandModel,
  ExternalCreatureModel,
  GuildModel,
  ImageModel,
  LanguageModel,
  MainMapHubModel,
  MainMapModel,
  PortalModel,
  ShipModel,
  ShipModuleTypeModel,
  ShipPartSubtypeModel,
  ShipPartTypeModel,
  TranslationLanguageModel,
  TranslationModel,
  TreeBranchModel,
  TreeModel,
  UserBeenToHubsModel,
  UserModel,
  UserSessionModel,
  UserShipModuleModel,
  UserShipPartModel,
} from "@src/models/db/index.js";
import AdminRoleService from "@src/services/admin/AdminRoleService.js";
import AdminService from "@src/services/admin/AdminService.js";
import AdminSessionService from "@src/services/admin/AdminSessionService.js";
import CountryService from "@src/services/CountryService.js";
import DBFilter from "@src/models/DBFilter.js";
import DungeonIslandService from "@src/services/DungeonIslandService.js";
import ExternalCreatureService from "@src/services/main_map/ExternalCreatureService.js";
import GuildService from "@src/services/GuildService.js";
import InlandCreatureModel from "@src/models/db/InlandCreatureModel.js";
import InlandCreatureService from "@src/services/InlandCreatureService.js";
import IterationModel from "@src/models/db/IterationModel.js";
import IterationService from "@src/services/IterationService.js";
import LanguageService from "@src/services/translation/LanguageService.js";
import MainMapHubService from "@src/services/main_map/MainMapHubService.js";
import MainMapService from "@src/services/main_map/MainMapService.js";
import NestModel from "@src/models/db/NestModel.js";
import NestService from "@src/services/NestService.js";
import NestTypeModel from "@src/models/db/NestTypeModel.js";
import NestTypeService from "@src/services/NestTypeService.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import ShipModuleTypeService from "@src/services/ship/ShipModuleTypeService.js";
import ShipPartTypeService from "@src/services/ship/ShipPartTypeService.js";
import ShipService from "@src/services/ship/ShipService.js";
import TranslationService from "@src/services/translation/TranslationService.js";
import TreeService from "@src/services/main_map/TreeService.js";
import UserIslandModel from "@src/models/db/UserIslandModel.js";
import UserIslandService from "@src/services/UserIslandService.js";
import UserService from "@src/services/user/UserService.js";
import UserSessionService from "@src/services/user/UserSessionService.js";
import UserShipModuleService from "@src/services/ship/UserShipModuleService.js";
import UserShipPartService from "@src/services/ship/UserShipPartService.js";
import TreeBranchService from "@src/services/main_map/TreeBranchService.js";
import PortalService from "@src/services/main_map/PortalService.js";
import Service from "@src/services/Service.js";
import UserRepository from "@src/repositories/user/UserRepository.js";
import UserBeenToHubsService from "@src/services/main_map/UserBeenToHubsService.js";
import ImageService from "@src/services/ImageService.js";
import ShipPartSubtypeService from "@src/services/ship/ShipPartSubtypeService.js";
import DBModel from "@src/models/db/DBModel.js";
import FieldTypes from "@src/enums/FieldTypes.js";

const router = express.Router();

const entityServices: Record<EntityType, any> = {
  [EntityType.ADMIN]: AdminService,
  [EntityType.ADMIN_ROLE]: AdminRoleService,
  [EntityType.ADMIN_SESSION]: AdminSessionService,
  [EntityType.COUNTRY]: CountryService,
  [EntityType.DUMMY]: DummyService,
  [EntityType.DUNGEON_ISLAND]: DungeonIslandService,
  [EntityType.EXTERNAL_CREATURE]: ExternalCreatureService,
  [EntityType.GUILD]: GuildService,
  [EntityType.INLAND_CREATURE]: InlandCreatureService,
  [EntityType.IMAGE]: ImageService,
  [EntityType.ITERATION]: IterationService,
  [EntityType.LANGUAGE]: LanguageService,
  [EntityType.MAIN_MAP]: MainMapService,
  [EntityType.MAIN_MAP_HUB]: MainMapHubService,
  [EntityType.NEST]: NestService,
  [EntityType.NEST_TYPE]: NestTypeService,
  [EntityType.PORTAL]: PortalService,
  [EntityType.SHIP]: ShipService,
  [EntityType.SHIP_MODULE_TYPE]: ShipModuleTypeService,
  [EntityType.SHIP_PART_TYPE]: ShipPartTypeService,
  [EntityType.SHIP_PART_SUBTYPE]: ShipPartSubtypeService,
  [EntityType.TRANSLATION]: TranslationService,
  [EntityType.TRANSLATION_LANGUAGE]: TranslationService,
  [EntityType.TREE]: TreeService,
  [EntityType.TREE_BRANCH]: TreeBranchService,
  [EntityType.USER]: UserService,
  [EntityType.USER_ISLAND]: UserIslandService,
  [EntityType.USER_SESSION]: UserSessionService,
  [EntityType.USER_SHIP_MODULE]: UserShipModuleService,
  [EntityType.USER_SHIP_PART]: UserShipPartService,
  [EntityType.USER_BEEN_TO_HUBS]: UserBeenToHubsService,
};

const entityModels: Record<EntityType, any> = {
  [EntityType.ADMIN]: AdminModel,
  [EntityType.ADMIN_ROLE]: AdminRoleModel,
  [EntityType.ADMIN_SESSION]: AdminSessionModel,
  [EntityType.COUNTRY]: CountryModel,
  [EntityType.DUMMY]: DummyModel,
  [EntityType.DUNGEON_ISLAND]: DungeonIslandModel,
  [EntityType.EXTERNAL_CREATURE]: ExternalCreatureModel,
  [EntityType.GUILD]: GuildModel,
  [EntityType.INLAND_CREATURE]: InlandCreatureModel,
  [EntityType.IMAGE]: ImageModel,
  [EntityType.ITERATION]: IterationModel,
  [EntityType.LANGUAGE]: LanguageModel,
  [EntityType.MAIN_MAP]: MainMapModel,
  [EntityType.MAIN_MAP_HUB]: MainMapHubModel,
  [EntityType.NEST]: NestModel,
  [EntityType.NEST_TYPE]: NestTypeModel,
  [EntityType.PORTAL]: PortalModel,
  [EntityType.SHIP]: ShipModel,
  [EntityType.SHIP_MODULE_TYPE]: ShipModuleTypeModel,
  [EntityType.SHIP_PART_TYPE]: ShipPartTypeModel,
  [EntityType.SHIP_PART_SUBTYPE]: ShipPartSubtypeModel,
  [EntityType.TRANSLATION]: TranslationModel,
  [EntityType.TRANSLATION_LANGUAGE]: TranslationLanguageModel,
  [EntityType.TREE]: TreeModel,
  [EntityType.TREE_BRANCH]: TreeBranchModel,
  [EntityType.USER]: UserModel,
  [EntityType.USER_ISLAND]: UserIslandModel,
  [EntityType.USER_SESSION]: UserSessionModel,
  [EntityType.USER_SHIP_MODULE]: UserShipModuleModel,
  [EntityType.USER_SHIP_PART]: UserShipPartModel,
  [EntityType.USER_BEEN_TO_HUBS]: UserBeenToHubsModel,
};

router.get(
  "/get-list",
  async (req: Request, res: Response, next: NextFunction) => {
    let keys = Object.keys(entityServices);
    keys = keys.filter((v) => v !== EntityType.DUMMY);
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
    const keysMetadata: { [key: string]: any } = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const metadata = model.getParameterAnnotations(key);
      keysMetadata[key] = metadata;
    }
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        keys,
        keysMetadata,
      }),
    );
  },
);

router.get(
  "/get/:entity/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const entityService: DummyService = new entityServices[
      params.entity as EntityType
    ]();
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

router.post(
  "/fast-filter/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params, query } = req;
    const from = query.from ? parseInt(query.from as string) : 0;
    const pageSize = query.pageSize ? parseInt(query.pageSize as string) : 10;
    const sortBy = query.sortBy as string;
    const sortDirection = query.sortDirection as string;
    const entityService: DummyService = new entityServices[
      params.entity as EntityType
    ]();
    const filters = DBFilter.parseObjects(req.body);
    const data = await entityService.getFastSearchAll(
      new SearchRequestData(from, pageSize, sortBy, sortDirection),
      query.text as string,
      new ParametersLimit(),
      filters,
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
  "/filter/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params, query } = req;
    const from = parseInt(query.from as string) ?? 0;
    const pageSize = parseInt(query.pageSize as string) ?? 10;
    const sortBy = query.sortBy as string;
    const sortDirection = query.sortDirection as string;
    const entityService: Service<any, any> = new entityServices[
      params.entity as EntityType
    ]();
    const filters = DBFilter.parseObjects(req.body);
    if (!entityService) {
      throw new PropagatedError();
    }
    const data = await entityService.getSearchAll(
      new SearchRequestData(from, pageSize, sortBy, sortDirection),
      new ParametersLimit(),
      filters,
    );
    const total = data.total;
    const preparedData = data.items.map((v) => v.prepareREST());
    const linkedEntitiesTypes: Array<string> = [];
    const linkedEntitiesToLoad: Record<
      string,
      Array<{ id: number; foreignId: number }>
    > = {}; // {[EntityType]: []}
    const loadedLinkedEntities: Record<number, Record<string, any>> = {};
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const keys = item.parametersKeys();
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const metadata = item.getParameterAnnotations(key);
        if (
          !item[key] ||
          metadata.fieldType !== FieldTypes.ENTITY_SELECT ||
          !metadata.fieldEntityType
        ) {
          continue;
        }
        if (
          !(linkedEntitiesToLoad[metadata.fieldEntityType] instanceof Array)
        ) {
          linkedEntitiesTypes.push(metadata.fieldEntityType);
          linkedEntitiesToLoad[metadata.fieldEntityType] = [];
        }
        linkedEntitiesToLoad[metadata.fieldEntityType].push({
          foreignId: item[key],
          id: item.id,
        });
      }
    }

    for (let i = 0; i < linkedEntitiesTypes.length; i++) {
      const entityType = linkedEntitiesTypes[i];
      const entitiesToLoad = linkedEntitiesToLoad[entityType];
      const service: Service<any, any> = new entityServices[
        entityType as EntityType
      ]();
      for (let j = 0; j < entitiesToLoad.length; j++) {
        const entityToLoad = entitiesToLoad[j];
        const filters: Array<DBFilter> = [
          new DBFilter("id", entityToLoad.foreignId),
        ];
        const loadedSearchData = await service.getSearchAll(
          new SearchRequestData(from, pageSize),
          undefined,
          filters,
        );
        for (let k = 0; k < loadedSearchData.items.length; k++) {
          const loadedData = loadedSearchData.items[k];
          if (!loadedLinkedEntities[entityToLoad.id]) {
            loadedLinkedEntities[entityToLoad.id] = {};
          }
          loadedLinkedEntities[entityToLoad.id][entityType] =
            loadedData.prepareREST();
        }
      }
    }

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        items: preparedData,
        total: total,
        loadedLinkedEntities,
      }),
    );
  },
);

router.post(
  "/create/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body, params } = req;
    const entityService: DummyService = new entityServices[
      params.entity as EntityType
    ]();
    const model = new entityModels[params.entity as EntityType]().parseObject(
      body,
    );
    const data = await entityService.create(model);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        id: data.id,
      }),
    );
  },
);

router.put(
  "/update/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body, params } = req;
    const entityService: DummyService = new entityServices[
      params.entity as EntityType
    ]();
    const model = new entityModels[params.entity as EntityType]().parseObject(
      body,
    );
    const data = await entityService.update(model);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        id: data.id,
      }),
    );
  },
);

router.delete(
  "/delete/:entity/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const entityService: DummyService = new entityServices[
      params.entity as EntityType
    ]();
    const data = await entityService.delete(parseInt(params.id));
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

export default router;
