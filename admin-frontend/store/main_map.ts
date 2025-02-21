import { defineStore } from "pinia";

import MittEvents from "~/core/enums/MittEvents";
import type { ResponseAPI } from "extorris-common";

interface MainMapPing {
  active: boolean;
}


interface MainMapState {
}

export const useMainMapStore = defineStore("main_map", {
  state: (): MainMapState => {
    return {
    };
  },
  getters: {
  },
  actions: {
    async loadHub(hubId: number): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/admin-api/main_map/load_hub/${hubId}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
    async loadIteration(iterationId: number): Promise<ResponseAPI | null> {
      if (!iterationId) {
        return null;
      }
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/admin-api/main_map/load_iteration/${iterationId}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
    async loadMainMap(mainMapId: number | string): Promise<ResponseAPI | null> {
      if (!mainMapId) {
        return null;
      }
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/admin-api/main_map/load_main_map/${mainMapId}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
    async generateIteration(
      layerAmount: number,
      mapDepth: number,
      treesDepthStart: number,
      startDate: Date | undefined,
      endDate: Date | undefined
    ): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/admin-api/main_map/generate_iteration/`,
        {
          method: "POST",
          body: {
            layerAmount,
            mapDepth,
            treesDepthStart,
            startDate,
            endDate,
          },
        }
      );
      return response.result;
    },
  },
});
