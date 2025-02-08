import http from "http";
import express, { Request, Response, NextFunction, response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import NodeWSServer from "@src/NodeWSServer.js";

import { CommsModels, RabbitMQModels } from "extorris-common";
import RabbitMQConnector from "@src/RabbitMQConnector.js";

let healthcheck = 0;

// known users

async function init() {
  const app = express();
  const server = http.createServer(app);
  const host = "0.0.0.0";
  const port = 8091;

  const rabbitmq = await RabbitMQConnector.getInstance("amqp://localhost:5672");
  const wsServer = new NodeWSServer(server);

  rabbitmq.setChatDequeueCallback((message) => {
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
  });

  wsServer.setOnMessage((ws, message, userId) => {
    if (
      message.fromWhere === CommsModels.CommsSourceEnum.USER_CLIENT &&
      message.messageType === CommsModels.CommsTypesEnum.CHAT_CHANGE
    ) {
      rabbitmq.enqueueUserChatMessage({
        chatId: message.data.chatId,
        message: message.data.message,
        userId,
      });
    }
  });

  app.use(cors());

  app.set("port", port);

  app.use(bodyParser.json({}));

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
