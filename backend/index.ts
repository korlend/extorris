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

import {
  adminRouter,
  userRouter,
  authenticatedRouter,
} from "@src/routers/index.js";

import "dotenv/config";

// import { createNoise2D, NoiseFunction2D } from "simplex-noise";

import PropagatedError from "@src/models/PropagatedError.js";
import ExpressNext from "@src/models/ExpressNext.js";
import {
  dbDataInit,
  redisDataInit,
  cronJobsInit,
} from "@src/initialization/startup.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import RedisConnector from "@src/core/RedisConnector.js";
import RabbitMQConnector from "@src/core/RabbitMQConnector.js";
import { CommsModels, RabbitMQModels } from "extorris-common";
import UserService from "@src/services/user/UserService.js";
import ChatService from "@src/services/chat/ChatService.js";
import RTCalcInstanceService from "@src/services/rtcalc/RTCalcInstanceService.js";
import ShipService from "@src/services/ship/ShipService.js";

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

let healthcheck = 0;

async function loadConfig() {
  await ConfigLoader.reload();
  return ConfigLoader.getInstance();
}

async function init(): Promise<express.Express> {
  // loading config
  const config = await loadConfig();
  if (!config || !config.configExists) {
    throw new Error("Couldn't load config");
  }

  await dbDataInit(config);
  await redisDataInit();
  cronJobsInit();

  const userApiUrlPrefix = config.get("userApiUrlPrefix");
  const adminApiUrlPrefix = config.get("adminApiUrlPrefix");
  const authenticatedApiUrlPrefix = config.get("authenticatedApiUrlPrefix");

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
  app.use(authenticatedApiUrlPrefix, authenticatedRouter);

  const rabbitmq = await RabbitMQConnector.getInstance(
    process.env.RABBITMQ || "amqp://localhost:5672",
  );

  rabbitmq?.setDequeueCallback(
    RabbitMQModels.RabbitMQKeys.USER_SENT_CHAT_MESSAGES,
    (message) => {
      console.log(
        `user ${message.userId} sent msg ${message.message} to chat ${message.chatId}`,
      );
      try {
        const chatService = new ChatService();
        chatService.userSentMessage(
          message.message,
          message.chatId,
          message.userId,
        );
      } catch (ex) {
        console.error(ex);
      }
    },
  );

  rabbitmq?.setDequeueCallback(
    RabbitMQModels.RabbitMQKeys.SHIP_ENTER_PORTAL,
    async (message) => {
      console.log(
        `ship: ${message.shipId}, entered portal: ${message.portalId}`,
      );
      const shipService = new ShipService();
      try {
        await shipService.shipEnteredPortal(
          message.shipId,
          message.portalId,
          message.fromHubId,
        );
      } catch (ex) {
        console.error(ex);
      }
    },
  );

  rabbitmq?.setDequeueCallback(
    RabbitMQModels.RabbitMQKeys.DECLARE_RTCALC,
    async (message) => {
      console.log(`rtcalc instance declared: ${message.uuid}`);
      try {
        const rtcalcInstanceService = new RTCalcInstanceService();
        await rtcalcInstanceService.createNewRTCalcInstance(message.uuid);
        const redisConnector = await RedisConnector.getInstance();
        await redisConnector.addActiveRTCalc(message.uuid);
      } catch (ex) {
        console.error(ex);
      }
    },
  );

  app.get("/rabbit", (req: Request, res: Response, next: NextFunction) => {
    rabbitmq?.channel.checkQueue(
      RabbitMQModels.RabbitMQKeys.CHAT_UPDATE_FOR_COMMS,
      (err, ok) => {
        console.log(ok.messageCount);
      },
    );
    rabbitmq?.channel.checkQueue(
      RabbitMQModels.RabbitMQKeys.USER_SENT_CHAT_MESSAGES,
      (err, ok) => {
        console.log(ok.messageCount);
      },
    );
  });

  app.all("/test", async (req: Request, res: Response, next: NextFunction) => {
    // console.log(data);
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
    // console.log(Object.keys(AdminRoleTypes));
    // console.log(Object.values(AdminRoleTypes));
    // @ts-ignore
    // console.log(Object.keys(AdminRoleTypes).map((v: any) => AdminRoleTypes[v]));
    // next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS));
    // try {
    //   const redisConnector = await RedisConnector.getInstance();
    //   next(
    //     ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
    //       first: await redisConnector.getUserSession(
    //         "c7c9fb8b-976c-44a9-a6c2-72fe797be68e",
    //       ),
    //       // all: await redisConnector.getAllUserSessions(),
    //     }),
    //   );
    // } catch (error) {
    //   next(
    //     ExpressResponseGenerator.getResponse(ExpressResponseTypes.ERROR, error),
    //   );
    // }
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
        if (prev.statusCode !== 200) {
          console.log(prev.responseObject);
        }
        return;
      }
    },
  );

  const server = http.createServer(app);
  server.listen(port, host);
  server.on("error", onError);
  server.on("listening", onListening);
  return app;
}

export const viteNodeApp = await init();
