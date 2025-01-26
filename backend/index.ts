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
import AdminRoleTypes from "@src/enums/AdminRoleTypes.js";

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const createError = require("http-errors");

let healthcheck = 0;

// doesn't work
// declare global {
//   interface NextFunction {
//     (result?: ExpressNext): void;
//   }
// }

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

  app.use(cors());
  app.use(express.static("public"));

  const port = normalizePort(config.get("port"));
  const host = normalizePort(config.get("host"));
  app.set("port", port);

  app.use(bodyParser.json({}));

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
    // console.log(typeof new AdminModel().id);
    // const adminModel = new AdminModel();
    // console.log(adminModel.parameterAnnotations("id"));
    console.log(Object.keys(AdminRoleTypes));
    console.log(Object.values(AdminRoleTypes));

    // @ts-ignore
    console.log(Object.keys(AdminRoleTypes).map((v: any) => AdminRoleTypes[v]));
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
      prev: ExpressNext | PropagatedError | Error,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      // console.log('test')
      // res.locals.error = req.app.get("env") === "development" ? prev : {};
      // console.log(prev);
      // console.log(Object.getPrototypeOf(prev));

      if (prev instanceof PropagatedError) {
        res.status(prev.responseCode).send({
          status: prev.responseCode,
          result: {
            message: prev.message,
            stack: prev.stack,
          },
        });
        console.error(new Date(), prev.responseCode, prev.responseType);
        return;
      }

      if (prev instanceof Error) {
        res.status(500).send({
          status: 500,
          result: {
            message: prev.message,
            stack: prev.stack,
          },
        });
        console.error(new Date(), prev.message, prev.stack);
        return;
      }

      if (prev instanceof ExpressNext) {
        res.status(prev.statusCode || 200).send({
          status: prev.statusCode,
          result: prev.responseObject || null,
          description: prev.text || undefined,
        });
        return;
      }
    },
  );

  const server = http.createServer(app);
  server.listen(port, host);
  server.on("error", onError);
  server.on("listening", onListening);
}

init();
