import type CommsTypesEnum from "./CommsTypesEnum";
import type CommsSourceEnum from "./CommsSourceEnum";
import type { HubEventTypes } from "@/enums";
import type { HubEvent } from "@/types/HubEvent";

interface CommsIncMessageChat {
  fromWhere: CommsSourceEnum.USER_CLIENT;
  messageType: CommsTypesEnum.CHAT_CHANGE;

  data: {
    chatId: number;
    message: string;
  };
}

interface CommsOutMessageChat {
  fromWhere: CommsSourceEnum.COMMS_SERVICE;
  messageType: CommsTypesEnum.CHAT_CHANGE;

  data: {
    id: number;
    chatId: number;
    message: string;
    userId: number;
  };
}

interface CommsIncMessagePosition {
  fromWhere: CommsSourceEnum.USER_CLIENT;
  messageType: CommsTypesEnum.SHIP_POSITION_CHANGE;

  data: {
    angle: number;
    speed: number;
  };
}

interface CommsOutMessagePosition {
  fromWhere: CommsSourceEnum.COMMS_SERVICE;
  messageType: CommsTypesEnum.SHIP_POSITION_CHANGE;

  data: {
    ships: Array<{
      id: number;
      speed: number;
      angle: number;
      hp: number;
      x: number;
      y: number;
    }>;
    hubId: number;
    // portals: Array<any>
    // enemies: Array<any>
    // nests: Array<any>
    // playerShips: Array<any>
    // playerIslands: Array<any>
  };
}

interface CommsIncMessageSubscribeToHub {
  fromWhere: CommsSourceEnum.USER_CLIENT;
  messageType: CommsTypesEnum.HUB_SUBSCRIBE;

  data: {
    hubId: number;
  };
}

interface CommsOutMessageHubEvent {
  fromWhere: CommsSourceEnum.COMMS_SERVICE;
  messageType: CommsTypesEnum.HUB_EVENT;

  data: HubEvent;
}

// messages from User to Comms
type CommsIncMessage =
  | CommsIncMessageChat
  | CommsIncMessagePosition
  | CommsIncMessageSubscribeToHub;

// messages from Comms to User
type CommsOutMessage =
  | CommsOutMessageChat
  | CommsOutMessagePosition
  | CommsOutMessageHubEvent;

export { type CommsIncMessage, type CommsOutMessage };
