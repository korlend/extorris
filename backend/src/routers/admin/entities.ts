import express, { Request, Response, NextFunction } from "express";

import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import PropagatedError from "@src/models/PropagatedError.js";

import SearchRequestData from "@src/models/SearchRequestData.js";
import EntityType from "@src/enums/EntityType.js";

import DBFilter from "@src/models/DBFilter.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import Service from "@src/services/Service.js";
import entityModels from "@src/constants/entityModels.js";
import entityServices from "@src/constants/entityServices.js";
import DBModel from "@src/models/db/DBModel.js";
import { FieldTypes } from "extorris-common";

const router = express.Router();

router.get(
  "/get-list",
  async (req: Request, res: Response, next: NextFunction) => {
    let keys = Object.keys(entityServices);
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, keys),
    );
  },
);

router.get(
  "/get-info/:entity",
  async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const model: DBModel<any> = new entityModels[params.entity as EntityType]();
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
    const entityService: Service<any, any> = new entityServices[
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
    const entityService: Service<any, any> = new entityServices[
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
      filters,
    );
    const total = data.total;
    const preparedData = data.items.map((v) => v.prepareREST());

    // linking entities by foreign keys to show names, etc... instead of just ids

    const entitiesToLoad: Record<string, Array<number>> = {};
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const keys = item.parametersKeys();
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const value = item[key];
        const metadata = item.getParameterAnnotations(key);

        if (
          !value ||
          metadata.fieldType !== FieldTypes.ENTITY_SELECT ||
          !metadata.fieldEntityType
        ) {
          continue;
        }

        if (!entitiesToLoad[metadata.fieldEntityType]) {
          entitiesToLoad[metadata.fieldEntityType] = [value];
        } else {
          entitiesToLoad[metadata.fieldEntityType].push(value);
        }
      }
    }

    const loadedLinkedEntities: Record<string, Record<number, any>> = {};

    const entitiesKeys = Object.keys(entitiesToLoad);
    for (let i = 0; i < entitiesKeys.length; i++) {
      const entityType = entitiesKeys[i];
      const idsToLoad = entitiesToLoad[entityType];
      const service: Service<any, any> = new entityServices[
        entityType as EntityType
      ]();
      const dbFilters: Array<DBFilter<any>> = [];
      for (let j = 0; j < idsToLoad.length; j++) {
        dbFilters.push(new DBFilter("id", idsToLoad[j]));
      }
      const data = await service.getSearchAll(
        new SearchRequestData(0, 10000),
        dbFilters,
      );
      loadedLinkedEntities[entityType] = [];
      for (let j = 0; j < data.items.length; j++) {
        const item = data.items[j];
        loadedLinkedEntities[entityType][item.id] = item.prepareREST();
      }
    }

    // const linkedEntitiesTypes: Array<string> = []; // array of entity types
    // const linkedEntitiesToLoad: Record<
    //   string,
    //   Array<{ id: number; foreignId: number }>
    // > = {}; // {[parameter_key]: []}

    // const loadedLinkedEntities: Record<number, Record<string, any>> = {};
    // for (let i = 0; i < data.items.length; i++) {
    //   const item = data.items[i];
    //   const keys = item.parametersKeys();
    //   for (let j = 0; j < keys.length; j++) {
    //     const key = keys[j];
    //     const metadata = item.getParameterAnnotations(key);
    //     if (
    //       !item[key] ||
    //       metadata.fieldType !== FieldTypes.ENTITY_SELECT ||
    //       !metadata.fieldEntityType
    //     ) {
    //       continue;
    //     }
    //     if (
    //       !(linkedEntitiesToLoad[key] instanceof Array)
    //     ) {
    //       linkedEntitiesTypes.push(metadata.fieldEntityType);
    //       linkedEntitiesToLoad[key] = [];
    //     }
    //     linkedEntitiesToLoad[key].push({
    //       foreignId: item[key],
    //       id: item.id,
    //     });
    //   }
    // }

    // for (let i = 0; i < linkedEntitiesTypes.length; i++) {
    //   const entityType = linkedEntitiesTypes[i];
    //   const entitiesToLoad = linkedEntitiesToLoad[entityType];
    //   const service: Service<any, any> =
    //     new entityServices[entityType as EntityType]();
    //   for (let j = 0; j < entitiesToLoad.length; j++) {
    //     const entityToLoad = entitiesToLoad[j];
    //     const filters: Array<DBFilter<any>> = [
    //       new DBFilter("id", entityToLoad.foreignId),
    //     ];
    //     const loadedSearchData = await service.getSearchAll(
    //       new SearchRequestData(from, pageSize),
    //       filters,
    //     );
    //     for (let k = 0; k < loadedSearchData.items.length; k++) {
    //       const loadedData = loadedSearchData.items[k];
    //       if (!loadedLinkedEntities[entityToLoad.id]) {
    //         loadedLinkedEntities[entityToLoad.id] = {};
    //       }
    //       loadedLinkedEntities[entityToLoad.id][entityType] =
    //         loadedData.prepareREST();
    //     }
    //   }
    // }

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
    const entityService: Service<any, any> = new entityServices[
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
    const entityService: Service<any, any> = new entityServices[
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
    const entityService: Service<any, any> = new entityServices[
      params.entity as EntityType
    ]();
    const data = await entityService.delete(parseInt(params.id));
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  },
);

export default router;
