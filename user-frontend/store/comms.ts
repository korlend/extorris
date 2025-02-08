import { defineStore } from "pinia";

import { type ResponseAPI, CommsModels } from "extorris-common";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";

type OnMessage = (message: CommsModels.CommsOutMessage) => void;

interface CommsState {
  wsFailedAttempts: number;
  isConnectedBoolean: boolean;
  wsClient: CommsModels.BrowserWSClient | null;
  onMessages: Record<string, OnMessage>;
}

export const useCommsStore = defineStore("comms", {
  state: (): CommsState => {
    return {
      wsFailedAttempts: 0,
      isConnectedBoolean: false,
      wsClient: null,
      onMessages: {},
    };
  },
  getters: {
    getWSClient: (state) => {
      return state.wsClient;
    },
    isConnected: (state) => {
      return state.isConnectedBoolean;
    },
  },
  actions: {
    connect(token: string, onOpen?: () => void) {
      const self = this;

      if (
        this.wsClient &&
        (this.wsClient.isConnected || this.wsClient.isConnecting)
      ) {
        return;
      }

      this.wsClient = new CommsModels.BrowserWSClient(
        "ws://localhost:8091",
        token
      );

      this.wsClient.onError((error: Error) => {
        console.log("Connection Error");
        self.wsFailedAttempts++;
      });

      this.wsClient.onOpen(() => {
        if (typeof onOpen === "function") {
          onOpen();
        }
        console.log("WebSocket Client Connected");
      });

      this.wsClient.onClose(() => {
        console.log("echo-protocol Client Closed");
      });

      this.wsClient.onMessage((message) => {
        console.log("Received: '" + message + "'");
        createAlert(
          JSON.stringify(message.data),
          LocalAlertTypes.INFO,
          `${message.fromWhere} - ${message.messageType}`
        );
        const ids = Object.keys(self.onMessages);
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          const cb = self.onMessages[id];
          if (typeof cb === "function") {
            cb(message);
          }
        }
      });
    },
    disconnect() {
      this.wsClient?.disconnect();
    },
    // returns id to delete callback
    addOnMessage(callback: OnMessage, id: string = "") {
      id = id || window.crypto.randomUUID();
      this.onMessages[id] = callback;
      return id;
    },
    removeOnMessage(id: string = "") {
      id = id || window.crypto.randomUUID();
      delete this.onMessages[id];
      return id;
    },
    sendMessage(message: CommsModels.CommsIncMessage) {
      return this.wsClient?.send(message);
    },
  },
});
