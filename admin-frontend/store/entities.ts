// import { getItem } from "~/utils/localStorage";
import {
  FieldTypes,
  type ResponseEntitiesListAPI,
  type ResponseAPI,
  type ResponseEntityInfoAPI,
  type ResponseEntityDataAPI,
  type ResponseFilterAPI,
  type ResponseCreateUpdateAPI,
} from "extorris";
import { defineStore } from "pinia";
import type KeyAndMetadata from "~/core/interfaces/KeyAndMetadata";
import DBFilter from "~/core/models/db/DBFilter";

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
    async prepareUpdateCreateBody(
      data: any,
      keysWithMetadata: Array<KeyAndMetadata>
    ) {
      const resultData: Record<string, any> = {};
      for (let i = 0; i < keysWithMetadata.length; i++) {
        const { metadata, key } = keysWithMetadata[i];
        const value = data[key];
        if (metadata.fieldType === FieldTypes.IMAGE_PATH) {
          resultData[key] = await this.uploadImage(value as File);
          continue;
        }
        resultData[key] = value;
      }
      return resultData;
    },
    async loadEntitiesList(): Promise<ResponseEntitiesListAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI<ResponseEntitiesListAPI> = await $api(
        "/admin-api/entities/get-list",
        {
          method: "GET",
        }
      );
      this.setEntitiesList(response.result);
      return this.getEntitiesList;
    },
    async loadEntityKeys(entity: string): Promise<ResponseEntityInfoAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI<ResponseEntityInfoAPI> = await $api(
        `/admin-api/entities/get-info/${entity}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
    async loadEntity(
      entity: string,
      id: string | number
    ): Promise<ResponseEntityDataAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI<ResponseEntityDataAPI> = await $api(
        `/admin-api/entities/get/${entity}/${id}`,
        {
          method: "GET",
        }
      );
      return response.result;
    },
    async fastFilterEntity(
      entity: string,
      text?: string | number,
      from: number = 0,
      pageSize: number = 10,
      filters: Array<DBFilter> = [],
      sortBy?: string,
      sortDirection?: "asc" | "desc"
    ): Promise<ResponseFilterAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI<ResponseFilterAPI> = await $api(
        `/admin-api/entities/fast-filter/${entity}`,
        {
          method: "POST",
          query: {
            from,
            pageSize,
            text,
            sortBy,
            sortDirection,
          },
          body: [...filters],
        }
      );
      return response.result;
    },
    async filterEntity(
      entity: string,
      from: number,
      pageSize: number,
      filters: Array<DBFilter> = [],
      sortBy?: string,
      sortDirection?: "asc" | "desc"
    ): Promise<ResponseFilterAPI> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI<ResponseFilterAPI> = await $api(
        `/admin-api/entities/filter/${entity}`,
        {
          method: "POST",
          query: {
            from,
            pageSize,
            sortBy,
            sortDirection,
          },
          body: [...filters],
        }
      );
      return response.result;
    },
    async createEntity(
      entity: string,
      data: any,
      keysWithMetadata: Array<KeyAndMetadata>
    ): Promise<ResponseCreateUpdateAPI> {
      const { $api } = useNuxtApp();
      const preparedData = await this.prepareUpdateCreateBody(
        data,
        keysWithMetadata
      );
      const response: ResponseAPI<ResponseCreateUpdateAPI> = await $api(
        `/admin-api/entities/create/${entity}`,
        {
          method: "POST",
          body: preparedData,
        }
      );
      return response.result;
    },
    async updateEntity(
      entity: string,
      data: any,
      keysWithMetadata: Array<KeyAndMetadata>
    ): Promise<ResponseCreateUpdateAPI> {
      const { $api } = useNuxtApp();
      const preparedData = await this.prepareUpdateCreateBody(
        data,
        keysWithMetadata
      );
      const response: ResponseAPI<ResponseCreateUpdateAPI> = await $api(
        `/admin-api/entities/update/${entity}`,
        {
          method: "PUT",
          body: preparedData,
        }
      );
      return response.result;
    },
    async deleteEntity(entity: string, id: string): Promise<void> {
      const { $api } = useNuxtApp();
      const response: ResponseAPI<void> = await $api(
        `/admin-api/entities/delete/${entity}/${id}`,
        {
          method: "DELETE",
        }
      );
      return;
    },
    async uploadImage(file: File): Promise<string> {
      const { $api } = useNuxtApp();
      const formData = new FormData();
      formData.append("file", file);
      const response: ResponseAPI = await $api(
        "/admin-api/images/create_file/",
        {
          method: "POST",
          body: formData,
        }
      );
      return response.result.filename;
    },
  },
});
