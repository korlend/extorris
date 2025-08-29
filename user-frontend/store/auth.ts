// import { getItem } from "~/utils/localStorage";
import { defineStore } from "pinia";
import type { ResponseAPI } from "extorris-common";
import type Session from "~/core/interfaces/Session";
import { useCommsStore } from "@/store/comms";

type PostAuthCallback<T = any> = (session: Session) => Promise<T>;

interface AuthState {
  session: Session;
  postAuthCallbacks: Array<{
    cb: PostAuthCallback;
    resolve: (value: any | PromiseLike<any>) => void;
  }>;
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
      const { $api } = useNuxtApp();
      await $api("/api/auth/logout", {
        method: "PUT",
      });
      this.setUserData({});
      const commsStore = useCommsStore();
      commsStore.disconnect();
    },
    async login(username: string, password: string): Promise<Session | null> {
      const { $api } = useNuxtApp();
      const data = await $api<ResponseAPI>("/api/auth/login", {
        method: "POST",
        body: {
          username,
          password,
        },
      });

      if (!data?.result) {
        throw new Error();
      }

      const userData = this.setUserData(data.result);
      this.executePostAuth();
      return userData;
    },
    async register(
      username: string,
      email: string,
      password: string
    ): Promise<Session | null> {
      const { $api } = useNuxtApp();
      const data = await $api<ResponseAPI>("/api/auth/register", {
        method: "POST",
        body: {
          username,
          email,
          password,
        },
      });

      if (!data?.result) {
        throw new Error();
      }

      return this.setUserData(data.result);
    },
    async addPostAuthCallback<T>(callback: PostAuthCallback<T>) {
      if (typeof callback !== "function") {
        return;
      }

      if (this.authChecked) {
        return await callback(this.session);
      }
      const promise = new Promise<T>((resolve) => {
        this.postAuthCallbacks.push({
          cb: callback,
          resolve,
        });
      });
      return promise;
    },
    async executePostAuth() {
      if (!this.authChecked || !this.session.token) {
        throw "Execute post auth callback was called before authentication was verified";
      }
      const commsStore = useCommsStore();
      commsStore.connect(this.session.token);
      for (let i = 0; i < this.postAuthCallbacks.length; i++) {
        const { cb, resolve } = this.postAuthCallbacks[i];
        if (typeof cb === "function") {
          const result = await cb(this.session);
          resolve(result);
        }
      }
      this.postAuthCallbacks = [];
    },
    async me(): Promise<Session | null> {
      const { $api } = useNuxtApp();
      try {
        const data = await $api<ResponseAPI>("/api/auth/me", {
          method: "GET",
        });

        if (!data?.result) {
          throw new Error();
        }

        const userData = this.setUserData(data.result);
        this.executePostAuth();
        return userData;
      } catch (ex) {
        return null;
      }
    },
  },
});
