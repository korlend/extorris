import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ConfigDimensionsService from "@src/services/ConfigDimensionsService.js";
import { ConfigDimensionsTypes } from "extorris-common";

const router = express.Router();

router.get(
  "/dimensions",
  async (req: Request, res: Response, next: NextFunction) => {
    const configDimensionsService = new ConfigDimensionsService();
    const configDimensionsArray = await configDimensionsService.getAll(
      0,
      100000,
    );

    const configDimensions: Record<string, number> = {};
    for (let i = 0; i < configDimensionsArray.length; i++) {
      const dimension = configDimensionsArray[i];
      if (!dimension.name) {
        continue;
      }
      configDimensions[dimension.name] = dimension.value;
    }

    next(
      ExpressResponseGenerator.getResponse(
        ExpressResponseTypes.SUCCESS,
        configDimensions,
      ),
    );
  },
);

export default router;
