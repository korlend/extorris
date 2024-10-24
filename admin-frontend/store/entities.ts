// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";

export interface EntitiesState {
  entitiesList: Array<string>;
}

export const useEntitiesStore = defineStore("entities", {
  state: (): EntitiesState => {
    return {
      entitiesList: [],
    };
  },
  getters: {
    getEntitiesList: (state: EntitiesState) => {
      return state.entitiesList;
    },
  },
  actions: {
    setEntitiesList(entitiesList: Array<string>) {
      this.entitiesList = entitiesList;
    },
    async loadEntitiesList() {
      const { $api } = useNuxtApp();
      const response = await $api("/admin-api/entities/get-list", {
        method: "GET",
      });
      this.setEntitiesList(response.result);
      return this.getEntitiesList;
    },
    async loadEntityKeys(entity: string) {
      const { $api } = useNuxtApp();
      const response = await $api(`/admin-api/entities/get-info/${entity}`, {
        method: "GET",
      });
      return response.result;
    },
    async loadEntity(entity: string, id: string | number) {
      const { $api } = useNuxtApp();
      const response = await $api(`/admin-api/entities/get/${entity}/${id}`, {
        method: "GET",
      });
      return response.result;
    },
    async filterEntity(entity: string, from: number, pageSize: number) {
      const { $api } = useNuxtApp();
      const response = await $api(`/admin-api/entities/filter/${entity}`, {
        method: "GET",
        query: {
          from,
          pageSize,
        },
      });
      return response.result;
    },
    async createEntity(entity: string, data: any) {
      const { $api } = useNuxtApp();
      const response = await $api(`/admin-api/entities/create/${entity}`, {
        method: "POST",
        body: data,
      });
      return response.result;
    },
    async updateEntity(entity: string, data: any) {
      const { $api } = useNuxtApp();
      const response = await $api(`/admin-api/entities/update/${entity}`, {
        method: "PUT",
        body: data,
      });
      return response.result;
    },
  },
});
