import type NotifyUserTypes from "@/enums/NotifyUserTypes";
import type RTCalcInstructionsTypes from "@/enums/RTCalcInstructionsTypes";

interface RabbitMQChangedActiveHub {
  type: NotifyUserTypes.CHANGED_ACTIVE_HUB;
  newHubId: number;
}

type RabbitMQNotifyUser = RabbitMQChangedActiveHub;

export { type RabbitMQNotifyUser };
