import { defineStore } from "pinia";

import { CommsModels, type ResponseAPI } from "extorris-common";
import type { Hub, Portal } from "./main_map";
import { useCommsStore } from "./comms";

interface UserIsland {
  id: number;
  user_id: number;
  main_map_hub_id: number;
  hub_pos_x: number;
  hub_pos_y: number;
  layer: number;
}

interface HubState {
  currenHub?: Hub;
  portals: Array<Portal>;
  usersIslands: Array<UserIsland>;
}

export const useHubStore = defineStore("hub", {
  state: (): HubState => {
    return {
      currenHub: undefined,
      portals: [],
      usersIslands: [],
    };
  },
  getters: {
    getCurrentHub: (state) => {
      return state.currenHub;
    },
    getPortals: (state) => {
      return state.portals || [];
    },
    getUsersIslands: (state) => {
      return state.usersIslands || [];
    },
  },
  actions: {
    async loadHub(hubId?: number): Promise<void> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/api/main_map/load_hub/${hubId || 0}`,
        {
          method: "GET",
        }
      );
      const result = response.result;
      if (result && result.hub) {
        this.currenHub = result.hub;
        this.portals = result.portals;
        this.usersIslands = result.usersIslands;
        const commsStore = useCommsStore();
        commsStore.sendMessage({
          fromWhere: CommsModels.CommsSourceEnum.USER_CLIENT,
          messageType: CommsModels.CommsTypesEnum.HUB_SUBSCRIBE,
          data: {
            hubId: result.hub.id,
          },
        });
      }
    },
  },
});
