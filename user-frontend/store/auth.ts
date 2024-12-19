// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";
import type ResponseAPI from "~/core/interfaces/ResponseAPI";
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
      const { user, session } = sessionData;
      if (!user || !session) {
        this.session.username = "";
        this.session.email = "";
        this.session.expire = undefined;
        setLocalStorageItem("token", "");
        this.session.token = "";
        return this.session;
      }
      this.session.username = user.username;
      this.session.email = user.email;
      this.session.expire = new Date(session.expire);
      setLocalStorageItem("token", session.token);
      this.session.token = session.token;
      return this.session;
    },
    async logout() {
      await useAPI("/api/auth/logout", {
        method: "PUT",
      });
      this.setUserData({});
    },
    async login(username: string, password: string): Promise<Session | null> {
      const { data } = await useAPI<ResponseAPI>("/api/auth/login", {
        method: "POST",
        body: {
          username,
          password,
        },
      });

      if (!data.value || !data.value.result) {
        throw new Error();
      }

      return this.setUserData(data.value.result);
    },
    async register(
      username: string,
      email: string,
      password: string
    ): Promise<Session | null> {
      const { data } = await useAPI<ResponseAPI>("/api/auth/register", {
        method: "POST",
        body: {
          username,
          email,
          password,
        },
      });

      if (!data.value || !data.value.result) {
        throw new Error();
      }

      return this.setUserData(data.value.result);
    },
    async me(): Promise<Session | null> {
      try {
        const { data } = await useAPI<ResponseAPI>("/api/auth/me", {
          method: "GET",
        });

        if (!data.value || !data.value.result) {
          throw new Error();
        }

        return this.setUserData(data.value.result);
      } catch (ex) {
        return null;
      }
    },
  },
});
