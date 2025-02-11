// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";
import type { ResponseAPI } from "extorris-common";
import type Session from "~/core/interfaces/Session";
import { useCommsStore } from "@/store/comms";

type PostAuthCallback = (session: Session) => void;

interface AuthState {
  session: Session;
  postAuthCallbacks: Array<PostAuthCallback>;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    return {
      session: {},
      postAuthCallbacks: [],
    };
  },
  getters: {
    authChecked: (state) => {
      return !!(
        state.session &&
        state.session.expire &&
        state.session.token &&
        state.session.username
      );
    },
    getSession: (state) => {
      return state.session;
    },
    getToken: (state): string | null => {
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
      const commsStore = useCommsStore();
      commsStore.disconnect();
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

      const userData = this.setUserData(data.value.result);
      this.executePostAuth();
      return userData;
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
    async addPostAuthCallback(callback: PostAuthCallback) {
      if (typeof callback !== "function") {
        return;
      }

      if (this.authChecked) {
        await callback(this.session);
        return;
      }
      this.postAuthCallbacks.push(callback);
    },
    async executePostAuth() {
      if (!this.authChecked || !this.session.token) {
        throw "Execute post auth callback was called before authentication was verified";
      }
      const commsStore = useCommsStore();
      commsStore.connect(this.session.token);
      for (let i = 0; i < this.postAuthCallbacks.length; i++) {
        const cb = this.postAuthCallbacks[i];
        if (typeof cb === "function") {
          await cb(this.session);
        }
      }
      this.postAuthCallbacks = [];
    },
    async me(): Promise<Session | null> {
      try {
        const { data } = await useAPI<ResponseAPI>("/api/auth/me", {
          method: "GET",
        });

        if (!data.value || !data.value.result) {
          throw new Error();
        }

        const userData = this.setUserData(data.value.result);
        this.executePostAuth();
        return userData;
      } catch (ex) {
        return null;
      }
    },
  },
});
