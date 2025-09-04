import http from "http";
import express, { Request, Response, NextFunction, response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import NodeWSServer from "@src/NodeWSServer.js";

import "dotenv/config";

import { CommsModels, RabbitMQModels } from "extorris-common";
import RabbitMQConnector from "@src/RabbitMQConnector.js";
import RedisConnector from "@src/RedisConnector.js";

let healthcheck = 0;

const recalcTimeoutMS = 50;
let cycleActive = true;
let timesSent = 0;

const resendPositions = async (wsServer: NodeWSServer) => {
  if (!cycleActive) {
    setTimeout(() => resendPositions(wsServer), recalcTimeoutMS);
    return;
  }
  // console.log("Sending positions... ", timesSent);
  const redis = await RedisConnector.getInstance();
  const activeRTCalcInstances = await redis.getActiveRTCalcInstances();
  for (let i = 0; i < activeRTCalcInstances.length; i++) {
    const rtcalcUuid = activeRTCalcInstances[i];
    const activeHubs = await redis.getActiveHubs(rtcalcUuid);
    for (let j = 0; j < activeHubs.length; j++) {
      const hub = activeHubs[j];
      const shipsPositions = await redis.getShipsPositions(hub.shipIds);
      if (!shipsPositions) {
        continue;
      }
      wsServer.sendHubData(
        {
          fromWhere: CommsModels.CommsSourceEnum.COMMS_SERVICE,
          messageType: CommsModels.CommsTypesEnum.SHIP_POSITION_CHANGE,
          data: {
            ships: shipsPositions.map((pos) => ({
              id: pos.id,
              angle: pos.angle,
              hp: pos.hp,
              speed: pos.speed,
              x: pos.x,
              y: pos.y,
            })),
            hubId: hub.id,
          },
        },
        hub.id,
      );
    }
  }
  timesSent++;
  setTimeout(() => resendPositions(wsServer), recalcTimeoutMS);
};

async function init() {
  const app = express();
  const server = http.createServer(app);
  const host = process.env.HOST || "0.0.0.0";
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8091;
  const redis = await RedisConnector.getInstance();

  const rabbitmq = await RabbitMQConnector.getInstance(
    process.env.RABBITMQ || "amqp://localhost:5672",
  );
  const wsServer = new NodeWSServer(server);
  resendPositions(wsServer);

  rabbitmq?.setDequeueCallback(
    RabbitMQModels.RabbitMQKeys.CHAT_UPDATE_FOR_COMMS,
    (message) => {
      console.log("dequeuing message for chat", message);
      wsServer.send(
        {
          fromWhere: CommsModels.CommsSourceEnum.COMMS_SERVICE,
          messageType: CommsModels.CommsTypesEnum.CHAT_CHANGE,
          data: {
            id: message.id,
            chatId: message.chatId,
            message: message.message,
            userId: message.userId,
          },
        },
        message.updateUserIds,
      );
    },
  );

  rabbitmq?.setDequeueCallback(
    RabbitMQModels.RabbitMQKeys.NOTIFY_USER_OF_HUB_EVENT,
    (message) => {
      console.log("dequeuing message for chat", message);
      wsServer.send(
        {
          fromWhere: CommsModels.CommsSourceEnum.COMMS_SERVICE,
          messageType: CommsModels.CommsTypesEnum.HUB_EVENT,
          data: message.data,
        },
        message.userIds,
      );
    },
  );

  wsServer.setOnMessage(async (ws, message, userId) => {
    if (
      message.fromWhere === CommsModels.CommsSourceEnum.USER_CLIENT &&
      message.messageType === CommsModels.CommsTypesEnum.CHAT_CHANGE
    ) {
      rabbitmq?.enqueueMessage(
        RabbitMQModels.RabbitMQKeys.USER_SENT_CHAT_MESSAGES,
        {
          chatId: message.data.chatId,
          message: message.data.message,
          userId,
        },
      );
      return;
    }

    if (
      message.fromWhere === CommsModels.CommsSourceEnum.USER_CLIENT &&
      message.messageType === CommsModels.CommsTypesEnum.SHIP_POSITION_CHANGE
    ) {
      const shipId = await redis.getUserIdShipId(userId);
      if (!shipId) {
        return;
      }

      const { angle, speed } = message.data;

      redis.writeShipUserInstructions(shipId, {
        angle: angle,
        speed: speed,
        user_id: userId,
        ship_id: shipId,
      });
    }
  });

  app.use(cors());

  app.set("port", port);

  app.use(bodyParser.json({}));

  app.all(
    "/activate_calculations",
    (req: Request, res: Response, next: NextFunction) => {
      cycleActive = true;
      res.status(200).send(cycleActive);
    },
  );

  app.all(
    "/disable_calculations",
    (req: Request, res: Response, next: NextFunction) => {
      cycleActive = false;
      res.status(200).send(cycleActive);
    },
  );

  app.all("/test", (req: Request, res: Response, next: NextFunction) => {
    healthcheck = healthcheck + 1;
    res.status(200).send(healthcheck);
  });

  app.all("/healthcheck", (req: Request, res: Response, next: NextFunction) => {
    healthcheck = healthcheck + 1;
    res.status(200).send(healthcheck);
  });

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send();
  });

  server.listen(port, host);
  return app;
}

export const viteNodeApp = await init();
