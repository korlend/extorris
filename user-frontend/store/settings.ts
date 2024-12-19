// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";

export type ThemeType = "dark" | "light";

export interface SettingsState {
  theme: ThemeType;
}

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => {
    return {
      theme: "dark",
    };
  },
  getters: {
    getTheme: (state: SettingsState) => {
      return state.theme;
    },
  },
  actions: {
    setTheme(theme: ThemeType) {
      setLocalStorageItem("theme", theme);
      this.theme = theme;
      /**
       * it doesn't work
       */
      // const { $vuetify } = useNuxtApp();
      // console.log("$vuetify", $vuetify);
      // console.log("is dark", theme === "dark");
      // @ts-ignore
      // $vuetify.theme.dark = theme === "dark";
      // $vuetify.theme.dark(theme === "dark");
      // $vuetify.theme.global.current.value = 
      // $vuetify.theme.themes.value.light.dark = theme === "dark";
      // $vuetify.theme.current.value.dark = theme === "dark";
      // @ts-ignore
      // $vuetify.theme.dark = theme === "dark";
    },
    initSettings() {
      console.log(
        "WHAT",
        getLocalStorageItem("theme") === "dark" ? "dark" : "light"
      );
      this.setTheme(getLocalStorageItem("theme") === "dark" ? "dark" : "light");
    },
  },
});
