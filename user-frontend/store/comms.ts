import { defineStore } from "pinia";

import { type ResponseAPI, CommsModels } from "extorris-common";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import { useAuthStore } from "./auth";

import { v4 as uuidv4 } from 'uuid';

type OnMessage = (message: CommsModels.CommsOutMessage) => void;

interface CommsState {
  wsFailedAttempts: number;
  wsClient: CommsModels.BrowserWSClient | null;
  onMessages: Record<string, OnMessage>;
}

export const useCommsStore = defineStore("comms", {
  state: (): CommsState => {
    return {
      wsFailedAttempts: 0,
      wsClient: null,
      onMessages: {},
    };
  },
  getters: {
    getWSClient: (state) => {
      return state.wsClient;
    },
  },
  actions: {
    async connect(token: string, onOpen?: () => void): Promise<void> {
      const self = this;
      if (
        this.wsClient &&
        (this.wsClient.isOpen || this.wsClient.isConnecting)
      ) {
        return;
      }

      return new Promise((resolve) => {
        this.wsClient = new CommsModels.BrowserWSClient(
          "ws://localhost:8091",
          token
        );

        // must implement SSE fallback
        this.wsClient.onError((error: Error) => {
          self.wsFailedAttempts++;
        });

        this.wsClient.onOpen(() => {
          if (typeof onOpen === "function") {
            onOpen();
          }
          resolve();
        });

        // possible try to reconnect on onClose, for now reconnect on trying to send a message
        // this.wsClient.onClose(() => {});

        this.wsClient.onMessage((message) => {
          // createAlert(
          //   JSON.stringify(message.data),
          //   LocalAlertTypes.INFO,
          //   `${message.fromWhere} - ${message.messageType}`
          // );
          const ids = Object.keys(self.onMessages);
          for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const cb = self.onMessages[id];
            if (typeof cb === "function") {
              cb(message);
            }
          }
        });
      });
    },
    disconnect() {
      this.wsClient?.disconnect();
      this.wsClient = null;
    },
    // returns id to delete callback
    addOnMessage(callback: OnMessage, id: string = "") {
      id = id || uuidv4();
      this.onMessages[id] = callback;
      return id;
    },
    removeOnMessage(id: string = "") {
      id = id || uuidv4();
      delete this.onMessages[id];
      return id;
    },
    async sendMessage(message: CommsModels.CommsIncMessage) {
      if (this.wsClient?.isConnecting) {
        setTimeout(() => this.sendMessage(message), 100);
        return;
      }
      if (this.wsClient?.isClosed) {
        this.disconnect();
        const authStore = useAuthStore();
        if (!authStore.getToken) {
          throw new Error(
            "User trying to send message, while not being authenticated"
          );
        }
        await this.connect(authStore.getToken);
      }
      this.wsClient?.send(message);
    },
  },
});
