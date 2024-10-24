import type { $Fetch, NitroFetchRequest } from "nitropack";

import type APIResponse from "~/interfaces/APIResponse";
import { useAuthStore } from "~/store/auth";

declare module "#app" {
  interface NuxtApp {
    $api: $Fetch<APIResponse, NitroFetchRequest>;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const session = useAuthStore();

  const api = $fetch.create({
    baseURL: "http://localhost:8090",
    onRequest({ request, options, error }) {
      const token = session.getToken;
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    async onResponseError({ response }) {
      // if (response.status === 401) {
      //   await nuxtApp.runWithContext(() => navigateTo("/login"));
      // }
      console.log("from custom fetch", response);
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
