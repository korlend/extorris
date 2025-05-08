import { exhaustiveCheck } from "../utils";
import DataKeys from "./DataKeys";

function buildRedisKey(
  key: DataKeys.USER_SESSIONS,
  sessionToken: string
): string;
function buildRedisKey(key: DataKeys.ACTIVE_HUBS_SET): string;
function buildRedisKey(key: DataKeys.USER_ID_SHIP_ID, userId: number): string;
function buildRedisKey(
  key: DataKeys.SHIP_USER_INSTRUCTIONS,
  shipId: number
): string;
function buildRedisKey(key: DataKeys.ACTIVE_HUB, hubId: number): string;
function buildRedisKey(key: DataKeys.SHIP_DATA, shipId: number): string;
function buildRedisKey(key: DataKeys.SHIP_POSITION, shipId: number): string;
function buildRedisKey(key: DataKeys, data?: string | number): string {
  switch (key) {
    case DataKeys.USER_SESSIONS:
      return `${key}:${data}`;
    case DataKeys.SHIP_DATA:
      return `${key}:${data}`;
    case DataKeys.SHIP_POSITION:
      return `${key}:${data}`;
    case DataKeys.SHIP_USER_INSTRUCTIONS:
      return `${key}:${data}`;
    case DataKeys.USER_ID_SHIP_ID:
      return `${key}:${data}`;
    case DataKeys.ACTIVE_HUB:
      return `${key}:${data}`;
    case DataKeys.ACTIVE_HUBS_SET:
      return key;
    default:
      exhaustiveCheck(key);
  }
  return key;
}

export default buildRedisKey;
