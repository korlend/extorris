import { defineStore } from "pinia";

import type { ResponseAPI } from "extorris";

interface HomeIslandState {
  userHomeIsland?: any;
}

export const useHomeIslandStore = defineStore("home_island", {
  state: (): HomeIslandState => {
    return {
      userHomeIsland: null,
    };
  },
  getters: {
    getUserHomeIsland(): any {
      return this.userHomeIsland;
    },
  },
  actions: {
    setUserShip() {
    },
    async loadHomeIslandInfo(): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api("/api/home_island/my_island_data", {
        method: "GET",
      });
      return response;
    },
  },
});
