import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { ResponseAPI } from "extorris-common";

import { useAuthStore } from "~/store/auth";

declare module "#app" {
  interface NuxtApp {
    $api: $Fetch<ResponseAPI, NitroFetchRequest>;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const session = useAuthStore();

  const api = $fetch.create({
    baseURL: getBackendUrl(),
    onRequest({ request, options, error }) {
      const token = session.getToken;
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    onResponseError({ response }) {
      handleAPIError(response._data);
    },
  });

  return {
    provide: {
      api,
    },
  };
});
