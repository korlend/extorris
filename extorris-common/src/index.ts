import ChatTypes from "./enums/ChatTypes";
import FieldTypes from "./enums/FieldTypes";
import ShipItemType from "./enums/ShipItemType";

export { FieldTypes, ShipItemType, ChatTypes };

import type { CanvasClickEvent } from "./canvas";
import { CanvasComponent } from "./canvas";
import type { CanvasBlock, CanvasElement, CanvasDrawOptions } from "./canvas";
import { CanvasCursors } from "./canvas";

import type ResponseAPI from "./REST/ResponseAPI";
import type ResponseCreateUpdateAPI from "./REST/ResponseCreateUpdateAPI";
import type ResponseEntityInfoAPI from "./REST/ResponseEntityInfoAPI";
import type ResponseFilterAPI from "./REST/ResponseFilterAPI";
import { type ResponseEntityDataAPI } from "./REST/ResponseEntityDataAPI";
import { type ResponseEntitiesListAPI } from "./REST/ResponseEntitiesListAPI";

import { type DBLogical } from "./types/DBLogical";
import { type DBOperand } from "./types/DBOperand";
import { type DBFilterSection } from "./types/DBFilterSection";

import {
  getHexCoordinatesBottomLeft,
  getHexCoordinatesLeft,
  getHexCoordinatesBottomRight,
  getHexCoordinatesRight,
  getHexCoordinatesTopLeft,
  getHexCoordinatesTopRight,
  getDepthItemMaxNumber,
  getHexData,
  getHexNearbyCoords,
  getHexesDirection,
  getReverseDirection,
  HexDirection,
} from "./utils/hexagonHelper";
import { throttle } from "./utils/throttle";
import { randomCheck, randomInt } from "./utils/randomizers";

import ModelPropertyMetadata from "./models/ModelPropertyMetadata";
import ModelPropertyMetadataTypes from "./enums/ModelPropertyMetadataTypes";
import type KeyAndMetadata from "./interfaces/KeyAndMetadata";
import type Metadata from "./interfaces/Metadata";

import type Vector2D from "./interfaces/Vector2D";
import type HexCoordinates from "./interfaces/HexCoordinates";
import type EntityInfo from "./interfaces/EntityInfo";

export const install = (app: any) => {
  app.component("canvas-component", CanvasComponent);
};

export {
  CanvasComponent,
  CanvasCursors,
  type CanvasBlock,
  type CanvasClickEvent,
  type CanvasElement,
  type CanvasDrawOptions,
};

export {
  type ResponseAPI,
  type ResponseCreateUpdateAPI,
  type ResponseEntityInfoAPI,
  type ResponseFilterAPI,
  type ResponseEntityDataAPI,
  type ResponseEntitiesListAPI,
};

export { type DBLogical, type DBOperand, type DBFilterSection };

export {
  getHexCoordinatesBottomLeft,
  getHexCoordinatesLeft,
  getHexCoordinatesBottomRight,
  getHexCoordinatesRight,
  getHexCoordinatesTopLeft,
  getHexCoordinatesTopRight,
  getDepthItemMaxNumber,
  getHexData,
  getHexNearbyCoords,
  getHexesDirection,
  getReverseDirection,
  HexDirection,
  throttle,
  randomCheck,
  randomInt,
};

export {
  ModelPropertyMetadata,
  ModelPropertyMetadataTypes,
  type KeyAndMetadata,
  type Metadata,
};

export { type Vector2D, type HexCoordinates, type EntityInfo };

export default {
  install,
};

export * as CommsModels from "./comms";
export * as RedisModels from "./redis";
export * as RabbitMQModels from "./rabbitmq";
