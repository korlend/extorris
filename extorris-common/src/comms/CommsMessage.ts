import type CommsTypesEnum from "./CommsTypesEnum";
import type CommsSourceEnum from "./CommsSourceEnum";

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
    }>,
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
  },
}

type CommsIncMessage = CommsIncMessageChat | CommsIncMessagePosition | CommsIncMessageSubscribeToHub;
type CommsOutMessage = CommsOutMessageChat | CommsOutMessagePosition;

export { type CommsIncMessage, type CommsOutMessage };
