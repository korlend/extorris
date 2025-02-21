import { defineStore } from "pinia";
import { ShipItemType } from "extorris-common";

import type { ResponseAPI } from "extorris-common";

interface ShipDataResponse {
  userShip: any;
  shipArmors: Array<any>;
  shipCannons: Array<any>;
  shipEnergyCores: Array<any>;
  shipEngines: Array<any>;
  shipHulls: Array<any>;
}

interface ShipState {
  userShip?: any;
  shipArmors: Array<any>;
  shipCannons: Array<any>;
  shipEnergyCores: Array<any>;
  shipEngines: Array<any>;
  shipHulls: Array<any>;
}

function applyShipItemType(array: Array<any>, type: ShipItemType) {
  return array.map((v: any) => ({
    ...v,
    _type: type,
  }));
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
    setUserShip(shipData: ShipDataResponse) {
      this.userShip = shipData.userShip;
      this.shipArmors = applyShipItemType(
        shipData.shipArmors,
        ShipItemType.ARMOR
      );
      this.shipCannons = applyShipItemType(
        shipData.shipCannons,
        ShipItemType.CANNON
      );
      this.shipEnergyCores = applyShipItemType(
        shipData.shipEnergyCores,
        ShipItemType.ENERGY_CORE
      );
      this.shipEngines = applyShipItemType(
        shipData.shipEngines,
        ShipItemType.ENGINE
      );
      this.shipHulls = applyShipItemType(shipData.shipHulls, ShipItemType.HULL);
    },
    async loadShipInfo(): Promise<void> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI<ShipDataResponse> = await $api(
        "/api/ship/my_ship_data",
        {
          method: "GET",
        }
      );
      this.setUserShip(response.result);
    },
    async equipShipItem(shipItem: any): Promise<void> {
      const { $api } = useNuxtApp();
      const url = `/api/ship/equip/${shipItem._type}`;
      await $api(url, {
        method: "PUT",
        body: shipItem,
      });
    },
    async unequipShipItem(shipItem: any): Promise<void> {
      const { $api } = useNuxtApp();
      const url = `/api/ship/unequip/${shipItem._type}`;
      await $api(url, {
        method: "PUT",
        body: shipItem,
      });
    },
    async flyOut(): Promise<void> {
      const { $api } = useNuxtApp();
      const url = `/api/ship/fly_out`;
      await $api(url, {
        method: "PUT",
      });
      useRouter().push({
        name: "hub-id",
        params: {
          id: 0,
        },
      });
    },
    async recallShip(): Promise<void> {
      const { $api } = useNuxtApp();
      const url = `/api/ship/recall_ship`;
      await $api(url, {
        method: "PUT",
      });
    },
  },
});
