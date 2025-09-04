import type { HubEvent } from "@/types/HubEvent";
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

// RTCALC_CHECK_ALIVE
interface RabbitMQRTCalcCheckAlive {
  uuid: string;
}

// NOTIFY_USER_OF_HUB_EVENT
interface RabbitMQNotifyUserOfHubEvent {
  userIds: Array<number>;
  data: HubEvent;
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
    : T extends RabbitMQKeys.RTCALC_CHECK_ALIVE
    ? RabbitMQRTCalcCheckAlive
    : T extends RabbitMQKeys.NOTIFY_USER_OF_HUB_EVENT
    ? RabbitMQNotifyUserOfHubEvent
    : never;

export { type RabbitMQMessage };
