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
    mapId: number;
    hubId: number;
    speed: number;
    angle: number;
    x: number;
    y: number;
    // portals: Array<any>
    // enemies: Array<any>
    // nests: Array<any>
    // playerShips: Array<any>
    // playerIslands: Array<any>
    // playerIslands: Array<any>
  };
}

type CommsIncMessage = CommsIncMessageChat | CommsIncMessagePosition
type CommsOutMessage = CommsOutMessageChat | CommsOutMessagePosition

export {
  type CommsIncMessage,
  type CommsOutMessage,
}
