import { v4 as uuidv4 } from "uuid";

import "dotenv/config";

import RabbitMQConnector from "@src/RabbitMQConnector.js";
import RedisConnector from "@src/RedisConnector.js";
import {
  isPointInCircle,
  RabbitMQModels,
  RedisModels,
  RTCalcInstructionsTypes,
  Vector2D,
} from "extorris-common";

const recalcTimeoutMS = 50;
let cycleActive = true;
let timesCalculated = 0;

let lastCheckAlive: Date | undefined;

const globalUUID: string = uuidv4();
let rabbitmq: RabbitMQConnector;
let redis: RedisConnector;

const calculatePositions = async () => {
  const uuid = globalUUID;
  const now = new Date();
  if (lastCheckAlive && now.getTime() - lastCheckAlive.getTime() > 10000) {
    await declareRTCalcService(uuid, rabbitmq);
    lastCheckAlive = now;
  }

  if (!cycleActive) {
    setTimeout(() => calculatePositions(), recalcTimeoutMS);
    return;
  }

  const instructions = await readInstructions(uuid, redis);
  await executeInstructions(instructions, uuid, rabbitmq, redis);

  // console.log("Calculating positions... ", timesCalculated);
  const activeHubs = await redis.getActiveHubs(uuid);
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

      // calculate new ship position
      const { angle, speed } = shipPosition;
      const previousTime = new Date(shipPosition.lastUpdate);
      const currentTime = new Date();
      const one_rad = 180 / Math.PI;
      const radians = angle / one_rad;
      const sin = Math.sin(radians);
      const radius =
        ((currentTime.getTime() - previousTime.getTime()) / 1000) * speed;
      let sk1 = sin * radius;
      let sk2 = Math.sqrt(Math.pow(radius, 2) - Math.pow(sk1, 2));

      // check portals collisions
      const portals = hub.portals;
      const shipPosVector = new Vector2D(shipPosition.x, shipPosition.y);
      let collisionPortal = null;
      for (let i = 0; i < portals.length; i++) {
        const portal = portals[i];
        const portalVector = new Vector2D(portal.x, portal.y);
        if (isPointInCircle(shipPosVector, portalVector, 250)) {
          collisionPortal = portal;
          break;
        }
      }

      if (collisionPortal) {
        console.log(
          `ship: ${ship.id}, entered portal: ${collisionPortal.id}, ${new Date().getMilliseconds()}`,
        );
        rabbitmq.enqueueMessage(RabbitMQModels.RabbitMQKeys.SHIP_ENTER_PORTAL, {
          shipId: ship.id,
          portalId: collisionPortal.id,
          fromHubId: hub.id,
        });
      }

      // check island collisions

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
  setTimeout(() => calculatePositions(), recalcTimeoutMS);
};

const readInstructions = async (uuid: string, redis: RedisConnector) => {
  const instructions = await redis.getRTCalcInstructions(uuid);
  return instructions;
};

const executeInstructions = async (
  instructions: Array<RedisModels.RTCalcInstructionData>,
  uuid: string,
  rabbitmq: RabbitMQConnector,
  redis: RedisConnector,
) => {
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    await executeInstruction(instruction, uuid, rabbitmq, redis);
  }
};

const executeInstruction = async (
  instruction: RedisModels.RTCalcInstructionData,
  uuid: string,
  rabbitmq: RabbitMQConnector,
  redis: RedisConnector,
) => {
  switch (instruction.type) {
    case RTCalcInstructionsTypes.ENLIST_ACTIVE_HUB: {
      await redis.writeActiveHub(uuid, instruction.data);
      // console.log(`instruction ${instruction.type} executed`);
      break;
    }

    case RTCalcInstructionsTypes.SHUTDOWN_RTCALC: {
      await redis.removeActiveHub(uuid, instruction.hubId);
      console.log(`instruction ${instruction.type} executed`);
      break;
    }

    case RTCalcInstructionsTypes.ADD_SHIP_TO_HUB: {
      const targetHub = await redis.getActiveHubs(instruction.hubId);
      if (!targetHub) {
        console.error(
          `Hub (${instruction.hubId}) doesn't exist in redis for rtcalc (${uuid})`,
        );
        break;
      }
      targetHub.shipIds.push(instruction.shipId);
      await redis.writeActiveHub(uuid, targetHub);
      console.log(`instruction ${instruction.type} executed`);
      break;
    }

    case RTCalcInstructionsTypes.REMOVE_SHIP_FROM_HUB: {
      const targetHub = await redis.getActiveHubs(instruction.hubId);
      if (!targetHub) {
        console.error(
          `Hub (${instruction.hubId}) doesn't exist in redis for rtcalc (${uuid})`,
        );
        break;
      }
      const newShipIds = targetHub.shipIds.filter(
        (shipId) => shipId !== instruction.shipId,
      );
      targetHub.shipIds = newShipIds;
      await redis.writeActiveHub(uuid, targetHub);
      console.log(`instruction ${instruction.type} executed`);
      break;
    }

    case RTCalcInstructionsTypes.CHANGE_SHIP_POSITION: {
      const { shipId, newPosX, newPosY, newAngle } = instruction;
      const previousShipPosition = await redis.getShipPosition(shipId);
      if (!previousShipPosition) {
        console.error(`Ship (${shipId}) position doesn't exist in redis`);
        break;
      }
      await redis.writeShipPosition({
        id: previousShipPosition.id,
        user_id: previousShipPosition.user_id,
        x: newPosX,
        y: newPosY,
        angle: newAngle,
        speed: 0,
        hp: previousShipPosition.hp,
        lastUpdate: previousShipPosition.lastUpdate,
      });
      console.log(`instruction ${instruction.type} executed`);
      break;
    }

    case RTCalcInstructionsTypes.REINIT_RTCALC: {
      await declareRTCalcService(uuid, rabbitmq);
      console.log(`instruction ${instruction.type} executed`);
      break;
    }

    case RTCalcInstructionsTypes.CHECK_ALIVE: {
      lastCheckAlive = new Date();
      await checkAliveRTCalc(uuid, rabbitmq);
      break;
    }
  }
};

const declareRTCalcService = async (
  uuid: string,
  rabbitmq: RabbitMQConnector,
) => {
  await rabbitmq.enqueueMessage(RabbitMQModels.RabbitMQKeys.DECLARE_RTCALC, {
    uuid,
  });
};

const checkAliveRTCalc = async (uuid: string, rabbitmq: RabbitMQConnector) => {
  await rabbitmq.enqueueMessage(
    RabbitMQModels.RabbitMQKeys.RTCALC_CHECK_ALIVE,
    {
      uuid,
    },
  );
};

async function init() {
  const rabbitAddress = process.env.RABBITMQ || "amqp://localhost:5672";
  const localRabbitmq = await RabbitMQConnector.getInstance(rabbitAddress);

  if (!localRabbitmq) {
    console.error(`Rabbit in ${rabbitAddress} unavailable, can't start`);
    return;
  }
  rabbitmq = localRabbitmq;

  const redisAddress = process.env.REDIS || "redis://127.0.0.1:6379";
  redis = await RedisConnector.getInstance({
    url: redisAddress,
  });

  if (!redis.isReady) {
    console.error(`Redis in ${redisAddress} unavailable, can't start`);
    return;
  }

  await declareRTCalcService(globalUUID, rabbitmq);

  calculatePositions();
}

export const app = await init();
