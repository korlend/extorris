import { defineStore } from "pinia";

import type { HubLinksTypes, ResponseAPI } from "extorris-common";

export interface Iteration {
  id: number;
  start_date: string;
  end_date: string;
  active: number;
}

export interface MainMap {
  id: number;
  iteration_id: number;
  layer: number;
  map_depth: number;
  hub_links_type: HubLinksTypes;
}

export interface Hub {
  id: number;
  main_map_id: number;
  contamination_level: number;
  on_depth: number;
  hub_number: number;
}

export interface Portal {
  id: number;
  from_hub_id: number;
  to_hub_id: number;
  from_hub_position_x: number;
  from_hub_position_y: number;
  to_hub_position_x: number;
  to_hub_position_y: number;
}

interface MainMapState {
  iteration?: Iteration;
  maps: Array<MainMap>;
  hubs: Array<Hub>;
  portals: Array<Portal>;
}

export const useMainMapStore = defineStore("main_map", {
  state: (): MainMapState => {
    return {
      iteration: undefined,
      maps: [],
      hubs: [],
      portals: [],
    };
  },
  getters: {
    getIteration: (state) => {
      return state.iteration || null;
    },
    getMaps: (state) => {
      return state.maps || [];
    },
    getHubs: (state) => {
      return state.hubs || [];
    },
    getPortals: (state) => {
      return state.portals || [];
    },
  },
  actions: {
    async loadIteration() {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api(
        `/api/main_map/load_active_iteration`,
        {
          method: "GET",
        }
      );
      const result = response.result;
      console.log(result);
      this.iteration = result.iteration;
      this.maps = result.maps;
      this.hubs = result.hubs;
      this.portals = result.portals;
      return {
        iteration: this.iteration,
        maps: this.maps,
        hubs: this.hubs,
        portals: this.portals,
      };
    },
  },
});
