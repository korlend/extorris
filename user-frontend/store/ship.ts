import { defineStore } from "pinia";
import { ShipItemType } from "extorris-common";

import type { ResponseAPI } from "extorris-common";

interface ShipState {
  userShip?: any;
  shipArmors: Array<any>;
  shipCannons: Array<any>;
  shipEnergyCores: Array<any>;
  shipEngines: Array<any>;
  shipHulls: Array<any>;
}

export const useShipStore = defineStore("ship", {
  state: (): ShipState => {
    return {
      userShip: null,
      shipArmors: [],
      shipCannons: [],
      shipEnergyCores: [],
      shipEngines: [],
      shipHulls: [],
    };
  },
  getters: {
    getUserShip(): any {
      return this.userShip;
    },
    getShipArmors(): Array<any> {
      return this.shipArmors;
    },
    getShipCannons(): Array<any> {
      return this.shipCannons;
    },
    getShipEnergyCores(): Array<any> {
      return this.shipEnergyCores;
    },
    getShipEngines(): Array<any> {
      return this.shipEngines;
    },
    getShipHulls(): Array<any> {
      return this.shipHulls;
    },
    getEquippedArmor(): any {
      if (!this.userShip) {
        return null;
      }
      return this.shipArmors.find((v) => v.ship_id === this.userShip.id);
    },
    getEquippedCannons(): Array<any> {
      if (!this.userShip) {
        return [];
      }
      return this.shipCannons.filter((v) => v.ship_id === this.userShip.id);
    },
    getEquippedEnergyCore(): any {
      if (!this.userShip) {
        return null;
      }
      return this.shipEnergyCores.find((v) => v.ship_id === this.userShip.id);
    },
    getEquippedEngine(): any {
      if (!this.userShip) {
        return null;
      }
      return this.shipEngines.find((v) => v.ship_id === this.userShip.id);
    },
    getEquippedHull(): any {
      if (!this.userShip) {
        return null;
      }
      return this.shipHulls.find((v) => v.ship_id === this.userShip.id);
    },
  },
  actions: {
    setUserShip(ship: Record<string, any>) {
      this.userShip = ship;
    },
    async loadShipInfo(): Promise<ResponseAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI = await $api("/api/ship/my_ship_data", {
        method: "GET",
      });
      this.setUserShip(response.result?.userShip);
      this.shipArmors = response.result?.shipArmors.map((v: any) => ({
        ...v,
        _type: ShipItemType.ARMOR,
      }));
      this.shipCannons = response.result?.shipCannons.map((v: any) => ({
        ...v,
        _type: ShipItemType.CANNON,
      }));
      this.shipEnergyCores = response.result?.shipEnergyCores.map((v: any) => ({
        ...v,
        _type: ShipItemType.ENERGY_CORE,
      }));
      this.shipEngines = response.result?.shipEngines.map((v: any) => ({
        ...v,
        _type: ShipItemType.ENGINE,
      }));
      this.shipHulls = response.result?.shipHulls.map((v: any) => ({
        ...v,
        _type: ShipItemType.HULL,
      }));
      return response;
    },
    async equipShipItem(shipItem: any): Promise<any> {
      const { $api } = useNuxtApp();
      let url = "";
      switch (shipItem._type as ShipItemType) {
        case ShipItemType.ARMOR:
          url = "/api/ship/equip_ship_armor";
          break;
        case ShipItemType.CANNON:
          url = "/api/ship/equip_ship_cannon";
          break;
        case ShipItemType.ENERGY_CORE:
          url = "/api/ship/equip_ship_energy_core";
          break;
        case ShipItemType.ENGINE:
          url = "/api/ship/equip_ship_engine";
          break;
        case ShipItemType.HULL:
          url = "/api/ship/equip_ship_hull";
          break;
      }
      const response: ResponseAPI = await $api(url, {
        method: "PUT",
        body: shipItem,
      });
      return;
    },
    async unequipShipItem(shipItem: any): Promise<any> {
      const { $api } = useNuxtApp();
      let url = "";
      switch (shipItem._type as ShipItemType) {
        case ShipItemType.ARMOR:
          url = "/api/ship/unequip_ship_armor";
          break;
        case ShipItemType.CANNON:
          url = "/api/ship/unequip_ship_cannon";
          break;
        case ShipItemType.ENERGY_CORE:
          url = "/api/ship/unequip_ship_energy_core";
          break;
        case ShipItemType.ENGINE:
          url = "/api/ship/unequip_ship_engine";
          break;
        case ShipItemType.HULL:
          url = "/api/ship/unequip_ship_hull";
          break;
      }
      const response: ResponseAPI = await $api(url, {
        method: "PUT",
        body: shipItem,
      });
      return;
    },
  },
});
