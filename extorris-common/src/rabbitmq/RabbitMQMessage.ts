import type RabbitMQKeys from "./RabbitMQKeys";

// USER_SENT_CHAT_MESSAGES
interface RabbitMQUserChatMessage {
  chatId: number;
  userId: number;
  message: string;
}

// CHAT_UPDATE_FOR_COMMS
interface RabbitMQChatUpdate {
  id: number; // message_id
  chatId: number;
  message: string;
  userId: number;
  updateUserIds?: Array<number>;
}

// SHIP_ENTER_PORTAL
interface RabbitMQShipEnterPortal {
  shipId: number;
  portalId: number;
  fromHubId: number;
}

// DECLARE_RTCALC
interface RabbitMQDeclareRTCalc {
  uuid: string;
}

type RabbitMQMessage<T extends RabbitMQKeys> =
  T extends RabbitMQKeys.USER_SENT_CHAT_MESSAGES
    ? RabbitMQUserChatMessage
    : T extends RabbitMQKeys.CHAT_UPDATE_FOR_COMMS
    ? RabbitMQChatUpdate
    : T extends RabbitMQKeys.SHIP_ENTER_PORTAL
    ? RabbitMQShipEnterPortal
    : T extends RabbitMQKeys.DECLARE_RTCALC
    ? RabbitMQDeclareRTCalc
    : never;

export { type RabbitMQMessage };
