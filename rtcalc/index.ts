import http from "http";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import "dotenv/config";

import RabbitMQConnector from "@src/RabbitMQConnector.js";
import RedisConnector from "@src/RedisConnector.js";

let healthcheck = 0;

const recalcTimeoutMS = 50;
let cycleActive = true;
let timesCalculated = 0;

const calculatePositions = async () => {
  if (!cycleActive) {
    setTimeout(calculatePositions, recalcTimeoutMS);
    return;
  }
  // console.log("Calculating positions... ", timesCalculated);
  const redis = await RedisConnector.getInstance();
  const activeHubs = await redis.getActiveHubs();
  for (let i = 0; i < activeHubs.length; i++) {
    const hub = activeHubs[i];
    const ships = await redis.getShipData(hub.shipIds);
    for (let j = 0; j < ships.length; j++) {
      const ship = ships[j];
      if (!ship) {
        continue;
      }
      const userInstructions = await redis.getShipUserInstructions(ship.id);
      const shipPosition = await redis.getShipPosition(ship.id);
      if (!shipPosition || !userInstructions) {
        continue;
      }
      // use user instructions
      const targetAngle =
        typeof userInstructions.angle === "string"
          ? parseInt(userInstructions.angle)
          : userInstructions.angle || 0;
      const targetSpeed =
        typeof userInstructions.speed === "string"
          ? parseInt(userInstructions.speed)
          : userInstructions.speed || 0;
      shipPosition.angle = targetAngle;
      shipPosition.speed = targetSpeed;

      // calculate new position
      const { angle, speed } = shipPosition;
      const previousTime = new Date(shipPosition.lastUpdate);
      const currentTime = new Date();
      const one_rad = 180 / Math.PI;
      const radians = angle / one_rad;
      const sin = Math.sin(radians);
      const radius = (currentTime.getTime() - previousTime.getTime()) / 1000 * speed;
      let sk1 = sin * radius;
      let sk2 = Math.sqrt(Math.pow(radius, 2) - Math.pow(sk1, 2));

      // write new position
      if (angle > 90 && angle < 270) {
        shipPosition.x += sk1;
        shipPosition.y += sk2;
      } else {
        shipPosition.x += sk1;
        shipPosition.y -= sk2;
      }
      shipPosition.lastUpdate = currentTime.getTime();
      await redis.writeShipPosition(shipPosition);
    }
  }
  timesCalculated++;
  setTimeout(calculatePositions, recalcTimeoutMS);
};

async function init() {
  const app = express();
  const server = http.createServer(app);
  const host = process.env.HOST || "0.0.0.0";
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8092;

  const rabbitmq = await RabbitMQConnector.getInstance(
    process.env.RABBITMQ || "amqp://localhost:5672",
  );

  calculatePositions();

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
