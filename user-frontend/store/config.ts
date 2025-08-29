// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";
import type { ConfigDimensionsTypes, ResponseAPI } from "extorris-common";

type Dimensions = Record<ConfigDimensionsTypes, number>;

interface ConfigState {
  dimensions: Dimensions | null;
}

export const useConfigStore = defineStore("config", {
  state: (): ConfigState => {
    return {
      dimensions: null,
    };
  },
  getters: {
    getDimensions: (state) => {
      return state.dimensions;
    },
  },
  actions: {
    async loadConfigs(): Promise<void> {
      const { $api } = useNuxtApp();
      const data = await $api<ResponseAPI<Dimensions>>(
        "/authenticated/config/dimensions",
        {
          method: "GET",
        }
      );

      console.log("loadConfigs",data);

      if (!data.result) {
        throw new Error();
      }

      this.dimensions = data.result;
    },
  },
});
