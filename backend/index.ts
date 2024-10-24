import http from "http";
import express, { Request, Response, NextFunction, response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import ConfigLoader from "@src/core/config/ConfigLoader.js";
import {
  normalizePort,
  onError,
  onListening,
} from "@src/core/utils/HttpHelpers.js";

import { adminRouter, userRouter } from "@src/routers/index.js";

// import { createNoise2D, NoiseFunction2D } from "simplex-noise";

import PropagatedError from "@src/models/PropagatedError.js";
import ExpressNext from "@src/models/ExpressNext.js";
import { dbDataInit } from "@src/initialization/startup.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import AdminModel from "@src/models/db/AdminModel.js";

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const createError = require("http-errors");

let healthcheck = 0;

declare global {
  interface NextFunction {
    (result?: ExpressNext): void;
  }
}

async function loadConfig() {
  await ConfigLoader.reload();
  return ConfigLoader.getInstance();
}

async function init() {
  // loading config
  const config = await loadConfig();
  if (!config || !config.configExists) {
    throw new Error("Couldn't load config");
  }

  dbDataInit(config);

  const userApiUrlPrefix = config.get("userApiUrlPrefix");
  const adminApiUrlPrefix = config.get("adminApiUrlPrefix");

  const app = express();

  const port = normalizePort(config.get("port"));
  app.set("port", port);

  app.use(bodyParser.json({}));
  app.use(cors());

  // app.use(express.Router);
  app.use(adminApiUrlPrefix, adminRouter);
  app.use(userApiUrlPrefix, userRouter);

  app.all("/test", (req: Request, res: Response, next: NextFunction) => {
    healthcheck = healthcheck + 1;

    // console.log(req.headers.authorization?.split(" ")[1]);
    // console.log(req.baseUrl);
    // console.log(req.url);
    // console.log(req.hostname);
    // console.log(req.ip);
    // console.log(req.originalUrl);
    // console.log(req.path);
    // throw new PropagatedError();
    console.log(typeof new AdminModel().id);
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
  });

  app.all("/healthcheck", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(healthcheck);
    healthcheck = healthcheck + 1;
  });

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send();
  });

  // next handler
  app.use(
    (
      prev: ExpressNext | PropagatedError,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      // console.log('test')
      // res.locals.error = req.app.get("env") === "development" ? prev : {};
      // console.log(prev);
      // console.log(Object.getPrototypeOf(prev));

      if (prev instanceof PropagatedError) {
        res.status(prev.responseCode).send(prev);
        return;
      }

      if (prev instanceof ExpressNext) {
        res.status(prev.statusCode).send({
          status: prev.statusCode,
          result: prev.responseObject || null,
          description: prev.text || "",
        });
        return;
      }
      console.log('test2')
    },
  );

  const server = http.createServer(app);
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
}

init();
