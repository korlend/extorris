import type { HubEventTypes } from "@/enums";

interface UserChangedHub {
  type: HubEventTypes.USER_CHANGED_HUB;
  newHubId: number;
}

type HubEvent = UserChangedHub;

export { type HubEvent };
