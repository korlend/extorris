import type ResponseAPI from "./REST/ResponseAPI";
import type ResponseCreateUpdateAPI from "./REST/ResponseCreateUpdateAPI";
import type ResponseEntityInfoAPI from "./REST/ResponseEntityInfoAPI";
import type ResponseFilterAPI from "./REST/ResponseFilterAPI";
import { type ResponseEntityDataAPI } from "./REST/ResponseEntityDataAPI";
import { type ResponseEntitiesListAPI } from "./REST/ResponseEntitiesListAPI";

import { type DBLogical } from "./types/DBLogical";
import { type DBOperand } from "./types/DBOperand";
import { type DBFilterSection } from "./types/DBFilterSection";

import Vector2D from "./models/Vector2D";
import ModelPropertyMetadata from "./models/ModelPropertyMetadata";
import type KeyAndMetadata from "./interfaces/KeyAndMetadata";
import type Metadata from "./interfaces/Metadata";

import type HexCoordinates from "./interfaces/HexCoordinates";
import type EntityInfo from "./interfaces/EntityInfo";

export {
  type ResponseAPI,
  type ResponseCreateUpdateAPI,
  type ResponseEntityInfoAPI,
  type ResponseFilterAPI,
  type ResponseEntityDataAPI,
  type ResponseEntitiesListAPI,
};

export { type DBLogical, type DBOperand, type DBFilterSection };

export { Vector2D, ModelPropertyMetadata, type KeyAndMetadata, type Metadata };

export { type HexCoordinates, type EntityInfo };

/* vue components */
import { CanvasComponent } from "./canvas";

export const install = (app: any) => {
  app.component("canvas-component", CanvasComponent);
};

export default {
  install,
};
/* vue components */

export * from "./canvas";
export * from "./utils";
export * from "./enums";

export * as CommsModels from "./comms";
export * as RedisModels from "./redis";
export * as RabbitMQModels from "./rabbitmq";
