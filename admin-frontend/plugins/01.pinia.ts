import type { Pinia } from "pinia";
import { useMainStore } from "~/store";

declare module "#app" {
  interface NuxtApp {
    $pinia: Pinia;
  }
}

export default defineNuxtPlugin({
  name: 'pinia-plugin',
  setup: ({ $pinia }: any) => {
    return {
      provide: {
        store: useMainStore($pinia),
      },
    };
  },
});
