import { defineStore } from "pinia";

import MittEvents from "~/core/enums/MittEvents";
import type { ResponseAPI } from "extorris-common";

interface MainMapPing {
  active: boolean;
}

type MainMapPings = Record<number, Record<number, MainMapPing>>;

interface MainMapState {
  pings: MainMapPings;
}

export const useMainMapStore = defineStore("main_map", {
  state: (): MainMapState => {
    return {
      pings: {},
    };
  },
  getters: {
    getPings: (state: MainMapState): MainMapPings => {
      return state.pings;
    },
  },
  actions: {
    createPing(itemDepth: number, itemNumber: number) {
      const { $mittEmit } = useNuxtApp();

      if (!this.pings[itemDepth]) {
        this.pings[itemDepth] = {};
      }
      if (!this.pings[itemDepth][itemNumber]) {
        this.pings[itemDepth][itemNumber] = {
          active: true,
        };
        $mittEmit(MittEvents.MAIN_MAP_PING);
        return;
      }

      this.pings[itemDepth][itemNumber].active = true;
      $mittEmit(MittEvents.MAIN_MAP_PING);
    },
    deletePing(itemDepth: number, itemNumber: number) {
      if (!this.pings[itemDepth]) {
        this.pings[itemDepth] = {};
      }
      if (!this.pings[itemDepth][itemNumber]) {
        this.pings[itemDepth][itemNumber] = {
          active: false,
        };
        return;
      }

      this.pings[itemDepth][itemNumber].active = false;
    },
    async loadHub(
      hubId: number,
    ): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/api/main_map/load_hub/${hubId}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
    async loadMainMap(
      iterationId: number,
    ): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/api/main_map/load_iteration/${iterationId}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
    async loadIteration(
      iterationId: number,
    ): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/api/main_map/load_iteration/${iterationId}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
  },
});
