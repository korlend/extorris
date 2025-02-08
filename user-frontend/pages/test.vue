<template>
  <div class="test__page">
    <div>{{ counter }}</div>
    <div>{{ sessionStore.getToken }}</div>
    <!-- <v-btn @click="sendData">Send data</v-btn> -->
    <v-btn @click="reconnectWS">Reconnect</v-btn>
  </div>
</template>

<script setup lang="ts">
import { CommsModels } from "extorris-common";

import { useAuthStore } from "~/store/auth";
import { useCommsStore } from "~/store/comms";

import {
  w3cwebsocket as WebSocketClient,
  type ICloseEvent,
  type IMessageEvent,
} from "websocket";

const sessionStore = useAuthStore();
const commsStore = useCommsStore();

// let client: WebSocketClient;
let client: CommsModels.BrowserWSClient;
const counter: Ref<number> = ref(0);

onMounted(async () => {
  // reconnectWS();
});

const reconnectWS = async () => {
  commsStore.connect(sessionStore.getToken);
  // console.log("trying to connect");
  // const token = sessionStore.getToken;
  // if (client) {
  //   client.disconnect();
  // }

  // // client = new WebSocketClient(`ws://localhost:8091/${token}`);
  // client = new CommsModels.BrowserWSClient("ws://localhost:8091", token);

  // client.onError((error: Error) => {
  //   console.log("Connection Error");
  // });

  // client.onOpen(() => {
  //   console.log("WebSocket Client Connected");
  // });

  // client.onClose(() => {
  //   console.log("echo-protocol Client Closed");
  // });

  // client.onMessage((message) => {
  //   console.log("Received: '" + message + "'");
  // });
};

// const sendData = async () => {
//   await client.send({
//     fromWhere: CommsModels.CommsSourceEnum.USER_CLIENT,
//     messageType: CommsModels.CommsTypesEnum.SHIP_POSITION_CHANGE,
//     data: {
//       angle: 0,
//       speed: 1,
//     },
//   });
//   counter.value++;
// };
</script>

<style lang="scss" scoped>
.test__page {
  padding: 80px 20px 20px 20px;
  height: 100%;
  width: 100%;
}
</style>
