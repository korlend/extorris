import { defineStore } from "pinia";

import { type ResponseAPI, ChatTypes, CommsModels } from "extorris-common";

import { useCommsStore } from "@/store/comms";
import { useAuthStore } from "./auth";

export interface ChatMessage {
  id: number;
  chat_id: number;
  user_id: number;
  message: string;
}

export interface UserChat {
  id: number;
  guild_id?: number;
  type: ChatTypes;
  name: string;
}

interface ChatState {
  userChats: Array<UserChat>;
  messages: Array<ChatMessage>;
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => {
    return {
      userChats: [],
      messages: [],
    };
  },
  getters: {
    getUserChats: (state) => {
      return state.userChats;
    },
    getMessages: (state) => {
      return state.messages;
    },
  },
  actions: {
    send(message: string, chatId: number) {
      const commsStore = useCommsStore();

      const targetChat = this.userChats.find((chat) => chat.id === chatId);

      if (!targetChat) {
        return;
      }

      commsStore.sendMessage({
        fromWhere: CommsModels.CommsSourceEnum.USER_CLIENT,
        messageType: CommsModels.CommsTypesEnum.CHAT_CHANGE,
        data: {
          chatId,
          message: message,
        },
      });
    },
    receiveNewMessage(message: CommsModels.CommsOutMessage) {
      console.log("frontend recieved comms message", message)
      if (
        message.fromWhere === CommsModels.CommsSourceEnum.COMMS_SERVICE &&
        message.messageType === CommsModels.CommsTypesEnum.CHAT_CHANGE
      ) {
        const data = message.data;
        this.messages = [{
          id: data.id,
          chat_id: data.chatId,
          message: data.message,
          user_id: data.userId,
        }, ...this.messages]
      }
    },
    async reloadChatRooms() {
      const { $api } = useNuxtApp();
      const data = await $api<ResponseAPI>("/api/chat/load", {
        method: "GET",
      });

      console.log(data);
      console.log(data.result);
      console.log(JSON.stringify(data));

      if (!data || !data.result) {
        throw new Error();
      }

      this.userChats = data.result.chats;
      this.messages = data.result.messages;

      return {
        userChats: this.userChats,
        messages: this.messages,
      };
    },
  },
});
