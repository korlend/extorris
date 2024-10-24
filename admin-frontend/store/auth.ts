// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";

export interface AuthState {
  username: string;
  email: string;
  token: string;
  expire?: Date;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    return {
      username: "",
      email: "",
      token: "",
      expire: undefined,
    };
  },
  getters: {
    getUsername: (state: AuthState) => {
      return state.username;
    },
    getEmail: (state: AuthState) => {
      return state.email;
    },
    getToken: (state: AuthState) => {
      if (!state.token) {
        state.token = getLocalStorageItem("token");
      }
      return state.token;
    },
    getExpire: (state: AuthState) => {
      return state.expire;
    },
  },
  actions: {
    setUserData(sessionData: any) {
      const { admin, session } = sessionData;
      this.username = admin.username;
      this.email = admin.email;
      this.expire = new Date(session.expire);
      setLocalStorageItem("token", session.token);
      this.token = session.token;
    },
    async logout() {
      const { $api } = useNuxtApp();
      await $api("/admin-api/auth/logout", {
        method: "PUT",
      });
      setLocalStorageItem("token", "");
      this.username = "";
      this.email = "";
      this.token = "";
      this.expire = undefined;
    },
    async login(username: string, password: string): Promise<any> {
      const { $api } = useNuxtApp();
      const response = await $api("/admin-api/auth/login_username", {
        method: "POST",
        body: {
          username,
          password,
        },
      });

      this.setUserData(response.result);
      return response.result;
    },
    async me(): Promise<any> {
      const { $api } = useNuxtApp();
      const response = await $api("/admin-api/auth/me", {
        method: "GET",
      });

      this.setUserData(response.result);
      return response.result;
    },
  },
});
