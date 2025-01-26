// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";
import type { ResponseAPI } from "extorris";
import type Session from "~/core/interfaces/Session";

export interface AuthState {
  session: Session;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    return {
      session: {},
    };
  },
  getters: {
    getSession: (state: AuthState) => {
      return state.session;
    },
    getToken: (state: AuthState) => {
      const localStorageToken = getLocalStorageItem("token");
      if (localStorageToken) {
        return localStorageToken;
      }
      if (state.session.token) {
        return state.session.token;
      }
      return null;
    },
  },
  actions: {
    setUserData(sessionData: any): Session {
      const { admin, session } = sessionData;
      if (!admin || !session) {
        this.session.username = "";
        this.session.email = "";
        this.session.expire = undefined;
        setLocalStorageItem("token", "");
        this.session.token = "";
        return this.session;
      }
      this.session.username = admin.username;
      this.session.email = admin.email;
      this.session.expire = new Date(session.expire);
      setLocalStorageItem("token", session.token);
      this.session.token = session.token;
      return this.session;
    },
    async logout() {
      await useAPI("/admin-api/auth/logout", {
        method: "PUT",
      });
      this.setUserData({});
    },
    async login(username: string, password: string): Promise<Session | null> {
      const { data } = await useAPI<ResponseAPI>(
        "/admin-api/auth/login_username",
        {
          method: "POST",
          body: {
            username,
            password,
          },
        }
      );

      if (!data.value) {
        return null;
      }

      return this.setUserData(data.value.result);
    },
    async me(): Promise<Session | null> {
      const { data } = await useAPI<ResponseAPI>("/admin-api/auth/me", {
        method: "GET",
      });

      if (!data.value) {
        return null;
      }

      return this.setUserData(data.value.result);
    },
  },
});
