import { defineStore } from "pinia";

import type ResponseAPI from "~/core/interfaces/ResponseAPI";

interface ShipState {
  userShip?: any;
  userShipParts: Array<any>;
  equippedShipParts: Array<any>;
  existingShipParts: Array<any>;
}

export const useShipStore = defineStore("ship", {
  state: (): ShipState => {
    return {
      userShip: null,
      userShipParts: [],
      equippedShipParts: [],
      existingShipParts: [],
    };
  },
  getters: {
    getUserShip(): any {
      return this.userShip;
    },
    getUserShipParts(): Array<any> {
      return this.userShipParts;
    },
    getEquippedShip(): Array<any> {
      return this.equippedShipParts;
    },
    getExistingShipParts(): Array<any> {
      return this.existingShipParts;
    },
  },
  actions: {
    setUserShip(ship: Record<string, any>) {
      this.userShip = ship;
    },
    setUserShipParts(shipParts: Array<any>) {
      this.userShipParts = shipParts;
    },
    setEquippedShip(shipParts: Array<any>) {
      this.equippedShipParts = shipParts;
    },
    setExistingShipParts(shipParts: Array<any>) {
      this.existingShipParts = shipParts;
    },
    async loadShipInfo(): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api("/api/ship/my_ship_data", {
        method: "GET",
      });
      this.setUserShip(response.result?.userShip);
      this.setUserShipParts(response.result?.userShipParts);
      this.setEquippedShip(response.result?.equippedShipParts);
      this.setExistingShipParts(response.result?.existingShipParts);
      return response.result;
    },
  },
});
